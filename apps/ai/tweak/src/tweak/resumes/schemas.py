from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Annotated
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage


class ResumeChatMessage(BaseModel):
    role: str = Field(description="Role of the message sender (user or assistant)")
    content: str = Field(description="Content of the message")
    timestamp: Optional[str] = Field(default=None, description="Timestamp of the message")


class ResumeRequestSchema(BaseModel):
    model: str
    key: str
    user_id: str
    user_info: str
    company_info: str
    job_description: str
    resume: str
    user_message: Optional[str] = Field(default="", description="User's chat message")
    chat_history: Optional[List[BaseMessage]] = Field(default=[], description="Previous chat messages")

class ResumeResponseSchema(BaseModel):
    messages: List[BaseMessage]
    status: int
    resume: str

class ResumeStructuredOutput(BaseModel):
    resume: str = Field(description="The resume content in LaTeX format")
    messages: Annotated[List[BaseMessage], add_messages] = Field(description="List of chat messages for the conversation")
    short_response: str = Field(description="A short response message (max 10 words) for the user, e.g., 'Done tweaking resume' or 'Resume updated successfully'")

class ResumeStructuredOutputForUpdateUserContext(BaseModel):
    response: Literal["ignore", "append"] = Field(description="Answer in either Ignore or Append")
