from typing import TypedDict, List, Optional

class State(TypedDict):
    model: str
    key: str
    user_id: str
    user_info: str
    company_info: str
    job_description: str
    coverletter: str
    coverletter_context: Optional[str]
    messages: List
    status: int
    user_message: Optional[str]
    chat_history: Optional[List]
    short_response: Optional[str]
