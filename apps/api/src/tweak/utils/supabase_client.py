import os
from supabase import create_client, Client
from typing import Dict, Any

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def get_coverletter_context(user_id: str) -> Dict[str, Any]:
    """Fetch cover letter context from Supabase for a specific user"""
    try:
        response = supabase.table("users").select("coverletter_context").eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            return response.data[0].get("coverletter_context", {})
        else:
            return {}
            
    except Exception as e:
        print(f"Error fetching cover letter context: {str(e)}")
        return {}

def update_coverletter_context(user_id: str, context_data: str) -> bool:
    """Update cover letter context in Supabase for a specific user"""
    try:
        response = supabase.table("users").update({
            "coverletter_context": context_data
        }).eq("user_id", user_id).execute()
        
        return response.data is not None and len(response.data) > 0
        
    except Exception as e:
        print(f"Error updating cover letter context: {str(e)}")
        return False
