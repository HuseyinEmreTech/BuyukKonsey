"""Configuration for the LLM Council."""

import os
import json
from dotenv import load_dotenv

load_dotenv()

# OpenRouter API key
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
SETTINGS_FILE = "data/settings.json"

# Default models
DEFAULT_COUNCIL_MODELS = [
    "openai/gpt-4o",
    "google/gemini-2.0-pro-exp-02-05:free",
    "anthropic/claude-3.5-sonnet",
    "x-ai/grok-2-1212",
]

DEFAULT_CHAIRMAN_MODEL = "google/gemini-2.0-pro-exp-02-05:free"

def get_settings():
    """Load settings from JSON file or return defaults."""
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading settings: {e}")
    
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

# For backward compatibility and initial load
_settings = get_settings()
COUNCIL_MODELS = _settings["council_models"]
CHAIRMAN_MODEL = _settings["chairman_model"]

def reload_config():
    """Reload configuration from file."""
    global COUNCIL_MODELS, CHAIRMAN_MODEL
    settings = get_settings()
    COUNCIL_MODELS = settings["council_models"]
    CHAIRMAN_MODEL = settings["chairman_model"]
