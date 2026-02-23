"""3-stage LLM Council orchestration."""

import asyncio
import logging
from typing import List, Dict, Any, Tuple, Optional
from .openrouter import query_models_parallel, query_model
from . import config

logger = logging.getLogger("llm-council.council")

# Stage-level timeouts (seconds)
STAGE1_TIMEOUT = 600.0  # 10 min for collecting all model responses
STAGE2_TIMEOUT = 300.0  # 5 min for collecting rankings
STAGE3_TIMEOUT = 180.0  # 3 min for chairman synthesis


async def stage1_collect_responses(
    user_query: str,
    conversation_history: Optional[List[Dict[str, str]]] = None,
    on_progress: Optional[callable] = None
) -> List[Dict[str, Any]]:
    """
    Stage 1: Collect individual responses from all council models.

    Args:
        user_query: The user's question
        conversation_history: Optional list of previous messages for context

    Returns:
        List of dicts with 'model' and 'response' keys
    """
    messages = []
    if conversation_history:
        messages.extend(conversation_history)
    messages.append({"role": "user", "content": user_query})

    try:
        # Query all models with staggering, wrapped in a stage-level timeout
        responses = await asyncio.wait_for(
            query_models_parallel(config.COUNCIL_MODELS, messages, on_progress=on_progress),
            timeout=STAGE1_TIMEOUT
        )
    except asyncio.TimeoutError:
        # Return timeout error for all models
        return [{
            "model": model,
            "response": f"Hata: Aşama 1 zaman aşımına uğradı ({int(STAGE1_TIMEOUT)}s). Model yanıt veremedi."
        } for model in config.COUNCIL_MODELS]

    # Format results
    stage1_results = []
    for model, response in responses.items():
        # Even if it's an error message, we include it to show the user what happened
        stage1_results.append({
            "model": model,
            "response": response.get('content', 'Model yanıt veremedi.')
        })

    return stage1_results


async def stage2_collect_rankings(
    user_query: str,
    stage1_results: List[Dict[str, Any]],
    on_progress: Optional[callable] = None
) -> Tuple[List[Dict[str, Any]], Dict[str, str]]:
    """
    Stage 2: Each model ranks the anonymized responses.

    Args:
        user_query: The original user query
        stage1_results: Results from Stage 1

    Returns:
        Tuple of (rankings list, label_to_model mapping)
    """
    # Create anonymized labels for responses (Response A, Response B, etc.)
    labels = [chr(65 + i) for i in range(len(stage1_results))]  # A, B, C, ...

    # Create mapping from label to model name
    label_to_model = {
        f"Response {label}": result['model']
        for label, result in zip(labels, stage1_results)
    }

    # Build the ranking prompt
    responses_text = "\n\n".join([
        f"Response {label}:\n{result['response']}"
        for label, result in zip(labels, stage1_results)
    ])

    ranking_prompt = f"""You are evaluating different responses to the following question:

Question: {user_query}

Here are the responses from different models (anonymized):

{responses_text}

Your task:
1. First, evaluate each response individually in the SAME LANGUAGE as the original question (e.g., if the question is in Turkish, your entire evaluation MUST be in Turkish). For each response, explain what it does well and what it does poorly.
2. Then, at the very end of your response, provide a final ranking.

IMPORTANT: Your final ranking MUST be formatted EXACTLY as follows (keep the English "FINAL RANKING:" header for system parsing):
- Start with the line "FINAL RANKING:" (all caps, with colon)
- Then list the responses from best to worst as a numbered list
- Each line should be: number, period, space, then ONLY the response label (e.g., "1. Response A")
- Do not add any other text or explanations in the ranking section

Example of the correct format for your ENTIRE response (assuming a Turkish question):

Yanıt A, X konusunda iyi detaylar veriyor ancak Y'yi kaçırmış...
Yanıt B doğru ama Z konusunda derinlikten yoksun...
Yanıt C en kapsamlı cevabı sunuyor...

FINAL RANKING:
1. Response C
2. Response A
3. Response B

Now provide your evaluation and ranking:"""

    messages = [{"role": "user", "content": ranking_prompt}]

    # Get rankings from all council models, with stage-level timeout
    try:
        responses = await asyncio.wait_for(
            query_models_parallel(config.COUNCIL_MODELS, messages, on_progress=on_progress),
            timeout=STAGE2_TIMEOUT
        )
    except asyncio.TimeoutError:
        # Return timeout error rankings
        timeout_results = [{
            "model": model,
            "ranking": f"Hata: Aşama 2 zaman aşımına uğradı ({int(STAGE2_TIMEOUT)}s).",
            "parsed_ranking": []
        } for model in config.COUNCIL_MODELS]
        return timeout_results, label_to_model

    # Format results
    stage2_results = []
    for model, response in responses.items():
        full_text = response.get('content', 'Sıralama yapılamadı.')
        parsed = parse_ranking_from_text(full_text)
        stage2_results.append({
            "model": model,
            "ranking": full_text,
            "parsed_ranking": parsed
        })

    return stage2_results, label_to_model


async def stage3_synthesize_final(
    user_query: str,
    stage1_results: List[Dict[str, Any]],
    stage2_results: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Stage 3: Chairman synthesizes final response.

    Args:
        user_query: The original user query
        stage1_results: Individual model responses from Stage 1
        stage2_results: Rankings from Stage 2

    Returns:
        Dict with 'model' and 'response' keys
    """
    # Build comprehensive context for chairman
    stage1_text = "\n\n".join([
        f"Model: {result['model']}\nResponse: {result['response']}"
        for result in stage1_results
    ])

    stage2_text = "\n\n".join([
        f"Model: {result['model']}\nRanking: {result['ranking']}"
        for result in stage2_results
    ])

    chairman_prompt = f"""You are the Chairman of an LLM Council. Multiple AI models have provided responses to a user's question, and then ranked each other's responses.

Original Question: {user_query}

STAGE 1 - Individual Responses:
{stage1_text}

STAGE 2 - Peer Rankings:
{stage2_text}

Your task as Chairman is to synthesize all of this information into a single, comprehensive, accurate answer to the user's original question. 

CRITICAL RULES:
1. You MUST answer in TURKISH (or the language of the original question).
2. DO NOT include introductory phrases like "After careful consideration..." or "Here is the comprehensive answer:".
3. DO NOT explain your synthesis process.
4. Just provide the direct, final, synthesized answer as if you are directly speaking to the user.

Provide your final synthesized response now:"""


    messages = [{"role": "user", "content": chairman_prompt}]

    # Query the chairman model with stage-level timeout
    try:
        response = await asyncio.wait_for(
            query_model(config.CHAIRMAN_MODEL, messages),
            timeout=STAGE3_TIMEOUT
        )
    except asyncio.TimeoutError:
        return {
            "model": config.CHAIRMAN_MODEL,
            "response": f"Hata: Başkan sentez aşaması zaman aşımına uğradı ({int(STAGE3_TIMEOUT)}s). Lütfen daha kısa bir soru ile tekrar deneyin."
        }

    content = response.get('content', '')
    if content.startswith("Hata:"):
        return {
            "model": config.CHAIRMAN_MODEL,
            "response": f"Başkan Sentez Yapamadı: {content}"
        }

    return {
        "model": config.CHAIRMAN_MODEL,
        "response": content
    }


def parse_ranking_from_text(ranking_text: str) -> List[str]:
    """
    Parse the FINAL RANKING section from the model's response.

    Args:
        ranking_text: The full text response from the model

    Returns:
        List of response labels in ranked order
    """
    import re

    # Look for "FINAL RANKING:" section
    if "FINAL RANKING:" in ranking_text:
        # Extract everything after "FINAL RANKING:"
        parts = ranking_text.split("FINAL RANKING:")
        if len(parts) >= 2:
            ranking_section = parts[1]
            # Try to extract numbered list format (e.g., "1. Response A")
            # This pattern looks for: number, period, optional space, "Response X"
            numbered_matches = re.findall(r'\d+\.\s*Response [A-Z]', ranking_section)
            if numbered_matches:
                # Extract just the "Response X" part
                return [re.search(r'Response [A-Z]', m).group() for m in numbered_matches]

            # Fallback: Extract all "Response X" patterns in order
            matches = re.findall(r'Response [A-Z]', ranking_section)
            return matches

    # Fallback: try to find any "Response X" patterns in order
    matches = re.findall(r'Response [A-Z]', ranking_text)
    return matches


def calculate_aggregate_rankings(
    stage2_results: List[Dict[str, Any]],
    label_to_model: Dict[str, str]
) -> List[Dict[str, Any]]:
    """
    Calculate aggregate rankings across all models.

    Args:
        stage2_results: Rankings from each model
        label_to_model: Mapping from anonymous labels to model names

    Returns:
        List of dicts with model name and average rank, sorted best to worst
    """
    from collections import defaultdict

    # Track positions for each model
    model_positions = defaultdict(list)

    for ranking in stage2_results:
        ranking_text = ranking['ranking']

        # Parse the ranking from the structured format
        parsed_ranking = parse_ranking_from_text(ranking_text)

        for position, label in enumerate(parsed_ranking, start=1):
            if label in label_to_model:
                model_name = label_to_model[label]
                model_positions[model_name].append(position)

    # Calculate average position for each model
    aggregate = []
    for model, positions in model_positions.items():
        if positions:
            avg_rank = sum(positions) / len(positions)
            aggregate.append({
                "model": model,
                "average_rank": round(avg_rank, 2),
                "rankings_count": len(positions)
            })

    # Sort by average rank (lower is better)
    aggregate.sort(key=lambda x: x['average_rank'])

    return aggregate


async def generate_conversation_title(user_query: str) -> str:
    """
    Generate a short title for a conversation based on the first user message.

    Args:
        user_query: The first user message

    Returns:
        A short title (3-5 words)
    """
    title_prompt = f"""Generate a very short title (3-5 words maximum) that summarizes the following question.
The title should be concise and descriptive. Do not use quotes or punctuation in the title.
IMPORTANT: The title MUST BE in the SAME LANGUAGE as the question below.

Question: {user_query}

Title:"""

    messages = [{"role": "user", "content": title_prompt}]

    # Use a fast, reliable model for title generation
    response = await query_model("openai/gpt-4o-mini", messages, timeout=30.0)

    content = response.get('content', 'New Conversation')
    if content.startswith("Hata:"):
        return "New Conversation"

    title = content.strip()

    # Clean up the title - remove quotes, limit length
    title = title.strip('"\'')

    # Truncate if too long
    if len(title) > 50:
        title = title[:47] + "..."

    return title


async def run_full_council(
    user_query: str,
    conversation_history: Optional[List[Dict[str, str]]] = None
) -> Tuple[List, List, Dict, Dict]:
    """
    Run the complete 3-stage council process.

    Args:
        user_query: The user's question
        conversation_history: Optional list of previous messages for context

    Returns:
        Tuple of (stage1_results, stage2_results, stage3_result, metadata)
    """
    logger.info("Starting council with %d history messages", len(conversation_history or []))

    # Stage 1: Collect individual responses
    stage1_results = await stage1_collect_responses(user_query, conversation_history)

    # If no models responded successfully, return error
    if not stage1_results:
        return [], [], {
            "model": "error",
            "response": "All models failed to respond. Please try again."
        }, {}

    # Stage 2: Collect rankings
    stage2_results, label_to_model = await stage2_collect_rankings(user_query, stage1_results)

    # Calculate aggregate rankings
    aggregate_rankings = calculate_aggregate_rankings(stage2_results, label_to_model)

    # Stage 3: Synthesize final answer
    stage3_result = await stage3_synthesize_final(
        user_query,
        stage1_results,
        stage2_results
    )

    # Prepare metadata
    metadata = {
        "label_to_model": label_to_model,
        "aggregate_rankings": aggregate_rankings
    }

    return stage1_results, stage2_results, stage3_result, metadata
