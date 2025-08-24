from typing_extensions import TypedDict, Annotated
from pydantic import BaseModel

from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

class TweakRequestSchema(BaseModel):
    user_info: dict
    company_info: dict
    job_description: dict
    resume: dict
    user_context_for_resume: dict
    coverletter: dict
    user_context_for_coverletter: dict
    coldemail: dict
    user_context_for_coldemail: dict

class State(TypedDict):
    model: str
    key: str
    user_info: dict
    company_info: dict
    job_description: dict
    # resume: dict
    # user_context_for_resume: dict
    # updated_context_for_resume: dict
    coverletter: dict
    user_context_for_coverletter: dict
    coverletter_messages: Annotated[list[BaseMessage], add_messages]
    updated_context_for_coverletter: dict
    # coldemail: dict
    # user_context_for_coldemail: dict
    # updated_context_for_coldemail: dict
    response: dict
