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
    resume: str
    resume_context: Optional[str]
    llm_type: Optional[str]
    model_used: Optional[str]
    messages: Annotated[List[BaseMessage], add_messages]
    humanized_pro_for_resume: bool
    status: int
    user_message: Optional[str]

class ResumeRequestSchema(BaseModel):
    model: str
    key: str
    user_id: str
    resume_context: str
    company_info: str
    job_description: str
    resume: str
    user_message: Optional[str] = Field(default="", description="User's chat message")
    thread_id: Optional[str] = Field(default=None, description="Thread ID for conversation continuity")
    humanized_pro_for_resume: bool
    
class ResumeResponseSchema(BaseModel):
    messages: Annotated[List[BaseMessage], add_messages]
    status: int
    resume: str
    thread_id: str

class ResumeResponseSchemaSerializable(BaseModel):
    """Serializable version for API responses"""
    messages: List[dict]
    status: int
    resume: str
    thread_id: str
    llm_type: Optional[str] = Field(default="unknown", description="Type of LLM used for processing (weak/strong)")
    model_used: Optional[str] = Field(default="unknown", description="Specific model name used for processing")

class ResumeStructuredOutput(BaseModel):
    resume: str = Field(description="The resume content in LaTeX format")
    short_response: str = Field(description="A short response message (max 10 words) for the user, e.g., 'Done tweaking resume' or 'Resume updated successfully'")

class ResumeStructuredOutputForUpdateUserContext(BaseModel):
    response: Literal["ignore", "append"] = Field(description="Answer in either Ignore or Append")

class ResumeHumanizeStructuredOutput(BaseModel):
    resume: str = Field(description="The humanized resume content")
