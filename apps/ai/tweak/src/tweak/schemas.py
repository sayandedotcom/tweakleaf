from typing import TypedDict, List, Optional, Annotated
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
    new_coverletter_context: Optional[str]
    llm_type: Optional[str]
    model_used: Optional[str]
    messages: Annotated[List[BaseMessage], add_messages]
    humanized_pro_for_coverletter: bool
    status: int
    user_message: Optional[str]
