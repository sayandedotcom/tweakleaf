from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class ChatMessage(BaseModel):
    role: str = Field(description="Role of the message sender (user or assistant)")
    content: str = Field(description="Content of the message")
    timestamp: Optional[str] = Field(default=None, description="Timestamp of the message")


class CoverLetterRequestSchema(BaseModel):
    model: str
    key: str
    user_id: str
    user_info: str
    company_info: str
    job_description: str
    coverletter: str
    user_message: Optional[str] = Field(default="", description="User's chat message")
    chat_history: Optional[List[ChatMessage]] = Field(default=[], description="Previous chat messages")
    # user_context_for_coverletter: str

class CoverLetterResponseSchema(BaseModel):
    messages: List[ChatMessage]
    # updated_context_for_coverletter: dict
    status: int
    coverletter: str

class CoverLetterStructuredOutput(BaseModel):
    coverletter: str = Field(description="The cover letter content in LaTeX format")
    messages: List[ChatMessage] = Field(description="List of chat messages for the conversation")
    short_response: str = Field(description="A short response message (max 10 words) for the user, e.g., 'Done tweaking cover letter' or 'Cover letter updated successfully'")

class CoverLetterStructuredOutputForUpdateUserContext(BaseModel):
    response: Literal["ignore", "append"] = Field(description="Answer in either Ignore or Append")
