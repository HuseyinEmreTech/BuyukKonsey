"""Configuration for the LLM Council."""

import os
import json
import logging
from dotenv import load_dotenv

load_dotenv()

# --- Logging Setup ---
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("llm-council")

# OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
if not OPENROUTER_API_KEY:
    logger.warning("OPENROUTER_API_KEY is not set! API calls will fail.")

# OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# CORS origins (comma-separated, from env or default)
CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:3000"
    ).split(",")
]

# Data directory for conversation storage
DATA_DIR = "data/conversations"
SETTINGS_FILE = "data/settings.json"

# Default models (ücretsiz + hızlı — ilk çalıştırma için optimize)
DEFAULT_COUNCIL_MODELS = [
    "google/gemini-2.0-flash-exp:free",
    "meta-llama/llama-4-maverick:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "qwen/qwen3-235b-a22b:free",
]

DEFAULT_CHAIRMAN_MODEL = "google/gemini-2.0-flash-exp:free"

def get_settings():
    """Load settings from JSON file or return defaults."""
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error("Error loading settings: %s", e)
    
    return {
        "council_models": DEFAULT_COUNCIL_MODELS,
        "chairman_model": DEFAULT_CHAIRMAN_MODEL
    }

def save_settings(council_models, chairman_model):
    """Save settings to JSON file."""
    os.makedirs(os.path.dirname(SETTINGS_FILE), exist_ok=True)
    with open(SETTINGS_FILE, "w") as f:
        json.dump({
            "council_models": council_models,
            "chairman_model": chairman_model
        }, f, indent=4)
    logger.info("Settings saved: %d council models, chairman=%s", len(council_models), chairman_model)

# For backward compatibility and initial load
_settings = get_settings()
COUNCIL_MODELS = _settings["council_models"]
CHAIRMAN_MODEL = _settings["chairman_model"]

def reload_config():
    """Reload configuration from file and environment."""
    global COUNCIL_MODELS, CHAIRMAN_MODEL, OPENROUTER_API_KEY
    # Reload API key from environment
    OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
    # Reload model settings
    settings = get_settings()
    COUNCIL_MODELS = settings["council_models"]
    CHAIRMAN_MODEL = settings["chairman_model"]
    logger.info("Config reloaded: models=%s, chairman=%s, api_key=%s", COUNCIL_MODELS, CHAIRMAN_MODEL, 'set' if OPENROUTER_API_KEY else 'NOT SET')
