from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Annotated
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages


class CoverLetterRequestSchema(BaseModel):
    model: str
    key: str
    user_id: str
    user_info: str
    company_info: str
    job_description: str
    coverletter: str
    user_message: Optional[str] = Field(default="", description="User's chat message")
    thread_id: Optional[str] = Field(default=None, description="Thread ID for conversation continuity")
    chat_history: Optional[List[dict]] = Field(default=[], description="Previous chat messages for context")

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

class CoverLetterStructuredOutput(BaseModel):
    coverletter: str = Field(description="The cover letter content in LaTeX format")
    short_response: str = Field(description="A short response message (max 10 words) for the user, e.g., 'Done tweaking cover letter' or 'Cover letter updated successfully'")

class CoverLetterStructuredOutputForUpdateUserContext(BaseModel):
    response: Literal["ignore", "append"] = Field(description="Answer in either Ignore or Append")
