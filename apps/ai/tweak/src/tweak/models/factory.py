from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_deepseek import ChatDeepSeek

from tweak.models.config import MODEL_CONFIGS

class ModelFactory:
    @staticmethod
    def create_model(provider: str, api_key: str, **kwargs):
        """
        Create a model instance based on the provider.
        
        Args:
            provider: The provider name ('openai', 'anthropic', 'gemini')
            api_key: API key for the provider
            **kwargs: Additional parameters to pass to the model
        
        Returns:
            A model instance
        """
        if provider not in MODEL_CONFIGS:
            raise ValueError(f"Unsupported provider: {provider}. Supported providers: {list(MODEL_CONFIGS.keys())}")
        
        config = MODEL_CONFIGS[provider]
        model_name = config['model']
        
        # Merge default params with provided kwargs
        params = {**config['default_params'], **kwargs}
        
        if provider == 'openai':
            # return ChatOpenAI(model=model_name, api_key=api_key, **params)
            return ChatOpenAI(base_url="https://models.github.ai/inference", model="openai/gpt-4.1", api_key="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")
        elif provider == 'anthropic':
            return ChatAnthropic(model=model_name, api_key=api_key, **params)
        elif provider == 'gemini':
            return ChatGoogleGenerativeAI(model=model_name, api_key=api_key, **params)
        elif provider == 'deepseek':
            return ChatDeepSeek(model=model_name, api_key=api_key, **params)
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