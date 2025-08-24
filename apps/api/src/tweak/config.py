from pydantic_settings import BaseSettings

class SetModel(BaseSettings):
    MODEL_NAME: str = "gpt-4.1-mini"
