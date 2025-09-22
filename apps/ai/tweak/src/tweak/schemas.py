from typing import TypedDict, List, Optional

class State(TypedDict):
    model: str
    key: str
    user_id: str
    company_info: str
    job_description: str
    coverletter: str
    coverletter_context: Optional[str]
    new_coverletter_context: Optional[str]
    llm_type: Optional[str]
    model_used: Optional[str]
    messages: List
    humanized_pro_for_coverletter: bool
    status: int
    user_message: Optional[str]
    chat_history: Optional[List]
    short_response: Optional[str]
