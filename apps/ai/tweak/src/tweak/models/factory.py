from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

from tweak.models.config import MODEL_CONFIGS, get_weak_model, get_strong_model

class ModelFactory:
    @staticmethod
    def create_model(provider: str, api_key: str, model: str = None, **kwargs):
        """
        Create a model instance based on the provider.
        
        Args:
            provider: The provider name ('openai', 'gemini')
            api_key: API key for the provider
            model: Specific model name (optional, uses default if not provided)
            **kwargs: Additional parameters to pass to the model
        
        Returns:
            A model instance
        """
        if provider not in MODEL_CONFIGS:
            raise ValueError(f"Unsupported provider: {provider}. Supported providers: {list(MODEL_CONFIGS.keys())}")
        
        config = MODEL_CONFIGS[provider]
        model_name = model if model else config['model']
        
        # Merge default params with provided kwargs
        params = {**config['default_params'], **kwargs}
        
        if provider == 'openai':
            return ChatOpenAI(model=model_name, api_key=api_key, **params)
        elif provider == 'gemini':
            return ChatGoogleGenerativeAI(model=model_name, api_key=api_key, **params)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    @staticmethod
    def get_available_providers():
        """Get list of available model providers."""
        return list(MODEL_CONFIGS.keys())
    
    @staticmethod
    def get_model_name(provider: str):
        """Get the model name for a specific provider."""
        if provider not in MODEL_CONFIGS:
            raise ValueError(f"Unsupported provider: {provider}")
        return MODEL_CONFIGS[provider]['model']
    
    @staticmethod
    def get_weak_model(provider: str):
        """Get the weak model name for a specific provider."""
        return get_weak_model(provider)
    
    @staticmethod
    def get_strong_model(provider: str):
        """Get the strong model name for a specific provider."""
        return get_strong_model(provider)