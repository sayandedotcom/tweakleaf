MODEL_CONFIGS = {
    'openai': {
        'provider': 'openai',
        'model': "gpt-4o",
        'default_params': {
            'temperature': 0,
            'max_tokens': None,
            'timeout': None,
            'max_retries': 2
        }
    },
    'gemini': {
        'provider': 'google', 
        'model': "gemini-2.0-flash-exp",
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
