"""OpenRouter API client with robust error handling and rate limiting."""

import asyncio
import httpx
from typing import List, Dict, Any, Optional
from .config import OPENROUTER_API_KEY, OPENROUTER_API_URL


async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 120.0
) -> Dict[str, Any]:
    """
    Query a single model via OpenRouter API with robust error handling.

    Returns:
        Response dict with 'content' (either model output or error message)
    """
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/karpathy/llm-council", # Recommended by OpenRouter
        "X-Title": "LLM Council",
    }

    payload = {
        "model": model,
        "messages": messages,
    }

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                OPENROUTER_API_URL,
                headers=headers,
                json=payload
            )
            
            if response.status_code == 429:
                return {"content": f"Hata: Model {model} hız sınırına (Rate Limit - 429) takıldı. Lütfen biraz bekleyin."}
            elif response.status_code == 402:
                return {"content": f"Hata: Model {model} için bakiye yetersiz veya model ücretliye döndü (402)."}
            elif response.status_code == 404:
                return {"content": f"Hata: Model {model} bulunamadı veya şu anda aktif değil (404)."}
            elif response.status_code == 400:
                # Often Gemini-specific or parameter related
                return {"content": f"Hata: Model {model} geçersiz istek döndürdü (400). Parametre uyumsuzluğu olabilir."}
            
            response.raise_for_status()

            data = response.json()
            if 'choices' not in data or not data['choices']:
                return {"content": f"Hata: Model {model} boş yanıt döndürdü."}
                
            message = data['choices'][0]['message']

            return {
                'content': message.get('content', "Model yanıt içeriği boş."),
                'reasoning_details': message.get('reasoning_details')
            }

    except httpx.HTTPStatusError as e:
        return {"content": f"Hata: {model} API hatası verdi ({e.response.status_code})."}
    except httpx.TimeoutException:
        return {"content": f"Hata: {model} için zaman aşımı (Timeout) oluştu."}
    except Exception as e:
        print(f"Unexpected error for {model}: {e}")
        return {"content": f"Hata: {model} sorgulanırken beklenmedik bir hata oluştu: {str(e)}"}


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]],
    stagger_delay: float = 3.5 # Increased delay for sequential processing
) -> Dict[str, Dict[str, Any]]:
    """
    Query multiple models SEQUENTIALLY to strictly avoid OpenRouter free tier rate limits.
    (Despite the name, we are running them sequentially for stability).
    """
    formatted_responses = {}
    
    for i, model in enumerate(models):
        if i > 0:
            await asyncio.sleep(stagger_delay)
            
        try:
            response = await query_model(model, messages)
            formatted_responses[model] = response
        except Exception as e:
            formatted_responses[model] = {"content": f"Hata: {model} için işlem sırasında kritik hata oluştu: {str(e)}"}

    return formatted_responses
