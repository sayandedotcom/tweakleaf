from typing import Dict, Any
from tweak.configs.db import supabase

def get_coverletter_context(user_id: str, authenticated_client=None) -> Dict[str, Any]:
    """
    Fetch cover letter context from Supabase for a specific user
    Uses authenticated client if provided, otherwise uses the default client
    """
    try:
        # Use authenticated client if provided, otherwise use default
        client = authenticated_client if authenticated_client else supabase
        
        response = client.table("users").select("coverletter_context").eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0].get("coverletter_context", {})
        else:
            return {}
            
    except Exception as e:
        print(f"Error fetching cover letter context: {str(e)}")
        return {}

def update_coverletter_context(user_id: str, context_data: Dict[str, Any], authenticated_client=None) -> bool:
    """
    Update cover letter context in Supabase for a specific user
    Uses authenticated client if provided, otherwise uses the default client
    """
    try:
        # Use authenticated client if provided, otherwise use default
        client = authenticated_client if authenticated_client else supabase
        
        response = client.table("users").update({
            "coverletter_context": context_data
        }).eq("user_id", user_id).execute()
        
        return response.data is not None and len(response.data) > 0
        
    except Exception as e:
        print(f"Error updating cover letter context: {str(e)}")
        return False
