"""FastAPI backend for LLM Council."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import uuid
import json
import asyncio
import os
import logging
from dotenv import set_key, load_dotenv

from . import storage
from . import config
from .council import run_full_council, generate_conversation_title, stage1_collect_responses, stage2_collect_rankings, stage3_synthesize_final, calculate_aggregate_rankings
import httpx
from typing import Optional

app = FastAPI(title="LLM Council API")

# Setup logging
logger = logging.getLogger(__name__)

# Manage background tasks and event broadcasting
ACTIVE_QUEUES: Dict[str, List[asyncio.Queue]] = {}
ACTIVE_TASKS: Dict[str, asyncio.Task] = {}

# Enable CORS for local development (origins configurable via CORS_ORIGINS env var)
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Settings(BaseModel):
    """Council and chairman model settings."""
    council_models: List[str]
    chairman_model: str


class ApiKeyUpdate(BaseModel):
    api_key: str


class CreateConversationRequest(BaseModel):
    """Request to create a new conversation."""
    pass


class SendMessageRequest(BaseModel):
    """Request to send a message in a conversation."""
    content: str


class ConversationMetadata(BaseModel):
    """Conversation metadata for list view."""
    id: str
    created_at: str
    title: str
    message_count: int


class Conversation(BaseModel):
    """Full conversation with all messages."""
    id: str
    created_at: str
    title: str
    messages: List[Dict[str, Any]]


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "ok", "service": "LLM Council API"}


@app.get("/api/conversations", response_model=List[ConversationMetadata])
async def list_conversations():
    """List all conversations (metadata only)."""
    return storage.list_conversations()


@app.post("/api/conversations", response_model=Conversation)
async def create_conversation(request: CreateConversationRequest):
    """Create a new conversation."""
    conversation_id = str(uuid.uuid4())
    conversation = storage.create_conversation(conversation_id)
    return conversation


@app.get("/api/conversations/{conversation_id}", response_model=Conversation)
async def get_conversation(conversation_id: str):
    """Get a specific conversation with all its messages."""
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@app.delete("/api/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str):
    """Delete a specific conversation."""
    success = storage.delete_conversation(conversation_id)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"status": "success", "message": "Conversation deleted"}


@app.post("/api/conversations/{conversation_id}/message")
async def send_message(conversation_id: str, request: SendMessageRequest):
    """
    Send a message and run the 3-stage council process.
    Returns the complete response with all stages.
    """
    # Check if conversation exists
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Check if this is the first message
    is_first_message = len(conversation["messages"]) == 0

    # Add user message
    storage.add_user_message(conversation_id, request.content)

    # If this is the first message, generate a title
    if is_first_message:
        title = await generate_conversation_title(request.content)
        storage.update_conversation_title(conversation_id, title)

    # Build conversation history for context (last 10 messages, simplified)
    history = []
    for msg in conversation["messages"][-10:]:
        if msg["role"] == "user":
            history.append({"role": "user", "content": msg["content"]})
        elif msg["role"] == "assistant" and msg.get("stage3"):
            history.append({"role": "assistant", "content": msg["stage3"].get("response", "")})

    # Run the 3-stage council process with conversation context
    stage1_results, stage2_results, stage3_result, metadata = await run_full_council(
        request.content,
        conversation_history=history
    )

    # Add assistant message with all stages
    storage.add_assistant_message(
        conversation_id,
        stage1_results,
        stage2_results,
        stage3_result
    )

    # Return the complete response with metadata
    return {
        "stage1": stage1_results,
        "stage2": stage2_results,
        "stage3": stage3_result,
        "metadata": metadata
    }


async def broadcast_event(conversation_id: str, event: Dict[str, Any]):
    """Send an event to all active listeners for a conversation."""
    if conversation_id in ACTIVE_QUEUES:
        for q in ACTIVE_QUEUES[conversation_id]:
            q.put_nowait(event)

async def council_worker(conversation_id: str, content: str, history: List[Dict[str, str]], is_first_message: bool):
    """Background worker that runs the 3-stage council and broadcasts progress."""
    try:
        # Start title generation in parallel
        title_task = None
        if is_first_message:
            title_task = asyncio.create_task(generate_conversation_title(content))

        # Stage 1: Collect responses
        await broadcast_event(conversation_id, {'type': 'stage1_start'})
        stage1_results = await stage1_collect_responses(
            content, 
            history,
            on_progress=lambda m, c, t: asyncio.create_task(broadcast_event(conversation_id, {'type': 'progress', 'stage': 1, 'model': m, 'current': c, 'total': t}))
        )
        await broadcast_event(conversation_id, {'type': 'stage1_complete', 'data': stage1_results})

        # Stage 2: Collect rankings
        await broadcast_event(conversation_id, {'type': 'stage2_start'})
        stage2_results, label_to_model = await stage2_collect_rankings(
            content, 
            stage1_results,
            on_progress=lambda m, c, t: asyncio.create_task(broadcast_event(conversation_id, {'type': 'progress', 'stage': 2, 'model': m, 'current': c, 'total': t}))
        )
        aggregate_rankings = calculate_aggregate_rankings(stage2_results, label_to_model)
        await broadcast_event(conversation_id, {
            'type': 'stage2_complete', 
            'data': stage2_results, 
            'metadata': {'label_to_model': label_to_model, 'aggregate_rankings': aggregate_rankings}
        })

        # Stage 3: Synthesize final answer
        await broadcast_event(conversation_id, {'type': 'stage3_start'})
        stage3_result = await stage3_synthesize_final(content, stage1_results, stage2_results)
        await broadcast_event(conversation_id, {'type': 'stage3_complete', 'data': stage3_result})

        # Wait for title generation
        if title_task:
            title = await title_task
            storage.update_conversation_title(conversation_id, title)
            await broadcast_event(conversation_id, {'type': 'title_complete', 'data': {'title': title}})

        # Save complete assistant message
        storage.add_assistant_message(conversation_id, stage1_results, stage2_results, stage3_result)
        await broadcast_event(conversation_id, {'type': 'complete'})

    except asyncio.TimeoutError:
        await broadcast_event(conversation_id, {
            'type': 'error', 
            'error_type': 'timeout', 
            'message': 'Zaman aşımı: İşlem belirtilen sürede tamamlanamadı.'
        })
    except Exception as e:
        await broadcast_event(conversation_id, {
            'type': 'error', 
            'error_type': 'unknown', 
            'message': str(e)
        })
    finally:
        # Cleanup
        if conversation_id in ACTIVE_TASKS:
            del ACTIVE_TASKS[conversation_id]
        # We don't delete ACTIVE_QUEUES here; the streaming endpoint handles its own cleanup

@app.post("/api/conversations/{conversation_id}/message/stream")
async def send_message_stream(conversation_id: str, request: SendMessageRequest):
    """
    Send a message and stream the 3-stage council process.
    Uses a background worker to ensure persistence across disconnections.
    """
    conversation = storage.get_conversation(conversation_id)
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")

    is_first_message = len(conversation["messages"]) == 0
    
    # Add user message to storage immediately
    storage.add_user_message(conversation_id, request.content)

    # Build history
    history = []
    for msg in conversation["messages"][-10:]:
        if msg["role"] == "user":
            history.append({"role": "user", "content": msg["content"]})
        elif msg["role"] == "assistant" and msg.get("stage3"):
            history.append({"role": "assistant", "content": msg["stage3"].get("response", "")})

    # Ensure worker is running
    if conversation_id not in ACTIVE_TASKS:
        ACTIVE_TASKS[conversation_id] = asyncio.create_task(
            council_worker(conversation_id, request.content, history, is_first_message)
        )

    async def event_generator():
        queue = asyncio.Queue()
        if conversation_id not in ACTIVE_QUEUES:
            ACTIVE_QUEUES[conversation_id] = []
        ACTIVE_QUEUES[conversation_id].append(queue)
        
        try:
            while True:
                event = await queue.get()
                yield f"data: {json.dumps(event)}\n\n"
                if event['type'] in ['complete', 'error']:
                    break
        finally:
            if conversation_id in ACTIVE_QUEUES:
                ACTIVE_QUEUES[conversation_id].remove(queue)
                if not ACTIVE_QUEUES[conversation_id]:
                    del ACTIVE_QUEUES[conversation_id]

    return StreamingResponse(
        event_generator(), 
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )


@app.delete("/api/conversations/{conversation_id}/cancel")
async def cancel_conversation_task(conversation_id: str):
    """Cancel a running background process for a conversation."""
    if conversation_id in ACTIVE_TASKS:
        task = ACTIVE_TASKS[conversation_id]
        task.cancel()
        del ACTIVE_TASKS[conversation_id]
        
        # Also clean up any active queues
        if conversation_id in ACTIVE_QUEUES:
            del ACTIVE_QUEUES[conversation_id]
            
        return {"status": "success", "message": "Görev iptal edildi"}
    
    return {"status": "not_found", "message": "Aktif bir görev bulunamadı"}


@app.get("/api/settings", response_model=Settings)
async def get_settings():
    """Get current council and chairman settings."""
    return config.get_settings()


@app.post("/api/settings")
async def update_settings(settings: Settings):
    """Update council and chairman settings."""
    config.save_settings(settings.council_models, settings.chairman_model)
    config.reload_config()
    return {"status": "success"}


@app.post("/api/config/apikey")
async def update_api_key(update: ApiKeyUpdate):
    """Update OpenRouter API key in .env file."""
    try:
        env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
        # Ensure file exists
        if not os.path.exists(env_path):
            with open(env_path, "w") as f:
                f.write("")
        
        # Update key
        set_key(env_path, "OPENROUTER_API_KEY", update.api_key)
        
        # Reload environment
        load_dotenv(env_path, override=True)
        # Update current process
        os.environ["OPENROUTER_API_KEY"] = update.api_key
        
        return {"status": "success", "message": "API key updated successfully"}
    except Exception as e:
        logger.error(f"Error updating API key: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


def get_model_speed(model_id: str, name: str) -> str:
    """Heuristic to determine an approximate model speed."""
    s = f"{model_id} {name}".lower()
    if any(x in s for x in ["turbo", "flash", "haiku", "8b", "mini", "instant", "fast", "lite"]):
        return "⚡ Hızlı"
    if any(x in s for x in ["pro", "opus", "70b", "405b", "huge", "large", "max", "r1"]):
        return "🐢 Yavaş"
    return "⏱️ Normal"

@app.get("/api/models")
async def list_available_models():
    """Fetch available models from OpenRouter."""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get("https://openrouter.ai/api/v1/models")
            response.raise_for_status()
            data = response.json()
            # Return a simplified list of models with pricing info
            models = []
            for m in data.get("data", []):
                pricing = m.get("pricing", {})
                # OpenRouter pricing is typically numeric strings or numbers
                prompt_price = float(pricing.get("prompt", "0"))
                completion_price = float(pricing.get("completion", "0"))
                is_free = prompt_price == 0 and completion_price == 0
                
                models.append({
                    "id": m["id"],
                    "name": m["name"],
                    "is_free": is_free,
                    "pricing": pricing,
                    "speed": get_model_speed(m["id"], m["name"])
                })
            return models
    except Exception as e:
        print(f"Error fetching models: {e}")
        # Return common fallback models if API call fails
        return [
            {"id": "openai/gpt-4o", "name": "GPT-4o", "is_free": False, "speed": "⚡ Hızlı"},
            {"id": "google/gemini-2.0-pro-exp-02-05:free", "name": "Gemini 2.0 Pro", "is_free": True, "speed": "🐢 Yavaş"},
            {"id": "anthropic/claude-3.5-sonnet", "name": "Claude 3.5 Sonnet", "is_free": False, "speed": "⏱️ Normal"},
            {"id": "deepseek/deepseek-chat", "name": "DeepSeek Chat", "is_free": False, "speed": "⏱️ Normal"}
        ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
