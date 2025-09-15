import uuid
from typing import Dict, Any

def generate_thread_id() -> str:
    """Generate a unique thread ID for conversation continuity."""
    return str(uuid.uuid4())

def get_thread_config(thread_id: str) -> Dict[str, Any]:
    """Get thread configuration for LangGraph."""
    return {"configurable": {"thread_id": thread_id}}

def get_or_create_thread_id(thread_id: str = None) -> str:
    """Get existing thread ID or create a new one."""
    return thread_id if thread_id else generate_thread_id()
