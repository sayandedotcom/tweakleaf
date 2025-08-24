from fastapi import APIRouter, Depends, HTTPException
from .clerk import get_clerk_payload
import os
from supabase import create_client, Client
from typing import Dict, Any

router = APIRouter()

# Initialize Supabase client
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@router.get("/public")
async def public():
    return {"message": "This is a public endpoint!"}

@router.get("/private")
async def private(clerk_payload: dict = Depends(get_clerk_payload)):
    return {"message": "This is a private endpoint!", "clerk_payload": clerk_payload}

@router.get("/greet")
async def greet_user(clerk_payload: dict = Depends(get_clerk_payload)):
    user_id = clerk_payload.get("sub")
    first_name = clerk_payload.get("first_name")
    greeting_name = first_name if first_name else f"User {user_id}"
    return {"message": f"Hello, {greeting_name}! Your JWT was successfully verified."}

@router.post("/coverletter-context")
async def update_coverletter_context(
    context_data: Dict[str, Any],
    clerk_payload: dict = Depends(get_clerk_payload)
):
    """
    Update coverletter context in Supabase (replicates the route.ts functionality)
    """
    try:
        # Get user ID from Clerk JWT
        user_id = clerk_payload.get("sub")
        
        if not user_id:
            raise HTTPException(status_code=400, detail="User ID not found in token")
        
        # Update the users table with coverletter_context
        # Note: You might need to adjust the table name and column based on your schema
        response = supabase.table("users").update({
            "coverletter_context": context_data
        }).eq("user_id", user_id).execute()
        
        # Check if the update was successful
        if response.data:
            return {
                "success": True,
                "message": "Cover letter context updated successfully",
                "data": response.data[0] if response.data else None,
                "user_id": user_id
            }
        else:
            # If no rows were updated, the user might not exist in the table
            # You might want to create the user record first
            raise HTTPException(
                status_code=404, 
                detail="User not found in database. You may need to create the user record first."
            )
            
    except Exception as e:
        print(f"Error updating coverletter context: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to update cover letter context: {str(e)}"
        )

@router.get("/user-info")
async def get_user_info(clerk_payload: dict = Depends(get_clerk_payload)):
    """
    Get detailed user information from Clerk API
    """
    import requests
    import os
    
    # Get user ID from JWT
    user_id = clerk_payload.get("sub")
    
    # Fetch complete user data from Clerk API
    clerk_api_key = os.getenv("CLERK_API_KEY", "sk_test_zNGCYI1jmZI4AvarxXKg78k4Ia6OcV4OLmifPVWd78")
    
    try:
        headers = {
            "Authorization": f"Bearer {clerk_api_key}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(
            f"https://api.clerk.com/v1/users/{user_id}",
            headers=headers
        )
        
        if response.status_code == 200:
            user_data = response.json()
            
            # Extract user information from Clerk API response
            user_info = {
                "user_id": user_id,
                "email": user_data.get("email_addresses", [{}])[0].get("email_address") if user_data.get("email_addresses") else None,
                "first_name": user_data.get("first_name"),
                "last_name": user_data.get("last_name"),
                "full_name": f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip() if user_data.get("first_name") or user_data.get("last_name") else None,
                "session_id": clerk_payload.get("sid"),
                "audience": clerk_payload.get("azp"),
                "issued_at": clerk_payload.get("iat"),
                "expires_at": clerk_payload.get("exp"),
                "issuer": clerk_payload.get("iss"),
                "role": clerk_payload.get("role"),
                "plan": clerk_payload.get("pla"),
                "all_claims": clerk_payload,  # Include all JWT claims for debugging
                "clerk_user_data": user_data  # Include full Clerk user data
            }
        else:
            # If API call fails, return basic JWT info
            user_info = {
                "user_id": user_id,
                "email": None,
                "first_name": None,
                "last_name": None,
                "full_name": None,
                "session_id": clerk_payload.get("sid"),
                "audience": clerk_payload.get("azp"),
                "issued_at": clerk_payload.get("iat"),
                "expires_at": clerk_payload.get("exp"),
                "issuer": clerk_payload.get("iss"),
                "role": clerk_payload.get("role"),
                "plan": clerk_payload.get("pla"),
                "all_claims": clerk_payload,
                "clerk_user_data": None,
                "error": "Failed to fetch user data from Clerk API"
            }
            
    except Exception as e:
        # If any error occurs, return basic JWT info
        user_info = {
            "user_id": user_id,
            "email": None,
            "first_name": None,
            "last_name": None,
            "full_name": None,
            "session_id": clerk_payload.get("sid"),
            "audience": clerk_payload.get("azp"),
            "issued_at": clerk_payload.get("iat"),
            "expires_at": clerk_payload.get("exp"),
            "issuer": clerk_payload.get("iss"),
            "role": clerk_payload.get("role"),
            "plan": clerk_payload.get("pla"),
            "all_claims": clerk_payload,
            "clerk_user_data": None,
            "error": f"Error fetching user data: {str(e)}"
        }
    
    print("user_info ⛔⛔⛔⛔", user_info)
    
    return {
        "message": "User information retrieved successfully",
        "user": user_info
    }