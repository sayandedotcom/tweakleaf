from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Annotated, TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class State(TypedDict):
    model: str
    key: str
    user_id: str
    company_info: str
    job_description: str
    coverletter: str
    coverletter_context: Optional[str]
    llm_type: Optional[str]
    model_used: Optional[str]
    messages: Annotated[List[BaseMessage], add_messages]
    humanized_pro_for_coverletter: bool
    status: int
    user_message: Optional[str]

class CoverLetterRequestSchema(BaseModel):
    model: str
    key: str
    user_id: str
    coverletter_context: str
    company_info: str
    job_description: str
    coverletter: str
    user_message: Optional[str] = Field(default="", description="User's chat message")
    thread_id: Optional[str] = Field(default=None, description="Thread ID for conversation continuity")
    humanized_pro_for_coverletter: bool
    
class CoverLetterResponseSchema(BaseModel):
    messages: Annotated[List[BaseMessage], add_messages]
    status: int
    coverletter: str
    thread_id: str

class CoverLetterResponseSchemaSerializable(BaseModel):
    """Serializable version for API responses"""
    messages: List[dict]
    status: int
    coverletter: str
    thread_id: str
    llm_type: Optional[str] = Field(default="unknown", description="Type of LLM used for processing (weak/strong)")
    model_used: Optional[str] = Field(default="unknown", description="Specific model name used for processing")

class CoverLetterStructuredOutput(BaseModel):
    coverletter: str = Field(description="The cover letter content in LaTeX format")
    short_response: str = Field(description="A short response message (max 10 words) for the user, e.g., 'Done tweaking cover letter' or 'Cover letter updated successfully'")

class CoverLetterStructuredOutputForUpdateUserContext(BaseModel):
    response: Literal["ignore", "append"] = Field(description="Answer in either Ignore or Append")

class CoverLetterHumanizeStructuredOutput(BaseModel):
    coverletter: str = Field(description="The humanized cover letter content")
