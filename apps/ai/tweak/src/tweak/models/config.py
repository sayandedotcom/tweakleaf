MODEL_CONFIGS = {
    'openai': {
        'provider': 'openai',
        'model': "gpt-4o",
        'weak_model': 'gpt-3.5-turbo',
        'strong_model': 'gpt-4o',
        'default_params': {
            'temperature': 0,
            'max_tokens': None,
            'timeout': None,
            'max_retries': 2
        }
    },
    'gemini': {
        'provider': 'google', 
        'model': "",
        # 'weak_model': 'gemini-2.0-flash-lite',
        # 'strong_model': 'gemini-2.5-flash-lite',
        'weak_model': 'gemini-2.5-flash-lite',
        'strong_model': 'gemini-2.5-pro',
        'default_params': {
            'temperature': 0,
            'max_tokens': None,
            'timeout': None,
            'max_retries': 2
        }
    },
    'anthropic': {
        'provider': 'anthropic',
        'model': "claude-3-5-sonnet-20241022",
        'weak_model': 'claude-3-haiku-20240307',
        'strong_model': 'claude-3-5-sonnet-20241022',
        'default_params': {
            'temperature': 0,
            'max_tokens': 1024,
            'timeout': None,
            'max_retries': 2
        }
    },
    'deepseek': {
        'provider': 'deepseek',
        'model': "deepseek-chat",
        'weak_model': 'deepseek-chat',
        'strong_model': 'deepseek-chat',
        'default_params': {
            'temperature': 0,
            'max_tokens': 1024,
            'timeout': None,
            'max_retries': 2
        }
    }
}

# Model name mappings for easy access
MODEL_NAMES = {
    'openai': MODEL_CONFIGS['openai']['model'],
    'gemini': MODEL_CONFIGS['gemini']['model'],
    'anthropic': MODEL_CONFIGS['anthropic']['model'],
    'deepseek': MODEL_CONFIGS['deepseek']['model']
}

# Convenience functions to get weak and strong models
def get_weak_model(provider: str) -> str:
    """Get the weak model name for a specific provider."""
    if provider not in MODEL_CONFIGS:
        raise ValueError(f"Unsupported provider: {provider}. Supported providers: {list(MODEL_CONFIGS.keys())}")
    return MODEL_CONFIGS[provider]['weak_model']

def get_strong_model(provider: str) -> str:
    """Get the strong model name for a specific provider."""
    if provider not in MODEL_CONFIGS:
        raise ValueError(f"Unsupported provider: {provider}. Supported providers: {list(MODEL_CONFIGS.keys())}")
    return MODEL_CONFIGS[provider]['strong_model']
