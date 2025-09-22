import os
import jwt
import requests
from typing import Optional, Dict, Any
from fastapi import HTTPException, status, Depends, APIRouter
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
from .config import Config

router = APIRouter()

# Your existing JWT validation functions (keep as is)
def validate_clerk_token(token: str, audience: str = None):
    try:
        # Get JWKS from Clerk
        jwks_response = requests.get(Config.CLERK_JWKS_URL)
        jwks_response.raise_for_status()
        jwks = jwks_response.json()
        
        # Decode token header to get key ID
        unverified_header = jwt.get_unverified_header(token)
        key_id = unverified_header.get('kid')
        
        if not key_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing key ID"
            )
        
        # Find the matching key in JWKS
        signing_key = None
        for key in jwks.get('keys', []):
            if key.get('kid') == key_id:
                signing_key = key
                break
        
        if not signing_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No matching key found"
            )
        
        # Convert JWK to PEM format for PyJWT
        from jwt.algorithms import RSAAlgorithm
        public_key = RSAAlgorithm.from_jwk(signing_key)
        
        # Verify and decode the JWT
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=audience,
            issuer=Config.CLERK_ISSUER,
        )
        return payload
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}",
        )

def get_clerk_payload(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())):
    return validate_clerk_token(credentials.credentials)

# NEW: Supabase client factory
class SupabaseService:
    def __init__(self):
        self.supabase_url = "https://itxvhvvnzgzbainblgpi.supabase.co"
        self.supabase_anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0eHZodnZuemd6YmFpbmJsZ3BpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDk5ODcsImV4cCI6MjA3MDQ4NTk4N30.WXm1cZDKZnTjZFygSkdDUkkJvTPBoi8yWiWFs-dxpLY"
        
        if not self.supabase_url or not self.supabase_anon_key:
            raise ValueError("Supabase URL and anon key must be set in environment variables")
    
    def get_client_with_jwt(self, jwt_token: str) -> Client:
        """Create authenticated Supabase client with JWT token"""
        options = ClientOptions(
            headers={
                "Authorization": f"Bearer {jwt_token}",
                "apikey": self.supabase_anon_key
            }
        )
        
        return create_client(
            self.supabase_url,
            self.supabase_anon_key,
            options=options
        )
    
    def get_admin_client(self) -> Client:
        """Create admin Supabase client (use sparingly)"""
        service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        if not service_key:
            raise ValueError("SUPABASE_SERVICE_ROLE_KEY must be set for admin operations")
        
        return create_client(self.supabase_url, service_key)

# Initialize the service
supabase_service = SupabaseService()

# NEW: Dependency to get authenticated Supabase client
def get_supabase_client(credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())) -> Client:
    """Get authenticated Supabase client for the current user"""
    return supabase_service.get_client_with_jwt(credentials.credentials)

# NEW: Combined dependency for both Clerk payload and Supabase client
def get_auth_context(
    clerk_payload: dict = Depends(get_clerk_payload),
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer())
):
    """Get both Clerk user info and authenticated Supabase client"""
    supabase_client = supabase_service.get_client_with_jwt(credentials.credentials)
    
    return {
        "user": clerk_payload,
        "supabase": supabase_client,
        "user_id": clerk_payload.get("sub")
    }

# UPDATED: Your existing endpoint with Supabase integration
@router.get("/user-info")
async def get_user_info(auth_context: dict = Depends(get_auth_context)):
    """Get detailed user information from Clerk API and sync with Supabase"""
    
    clerk_payload = auth_context["user"]
    supabase = auth_context["supabase"]
    user_id = auth_context["user_id"]
    
    # Get user ID from JWT
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
            
            print("user_data ⛔⛔⛔⛔", user_data)
            
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
                "all_claims": clerk_payload,
                "clerk_user_data": user_data
            }
            
            # NEW: Sync user data with Supabase
            try:
                # Update or insert user in Supabase
                result = supabase.table('users').upsert({
                    'id': user_id,  # Use Clerk user ID as primary key
                    'email': user_info["email"],
                    'first_name': user_info["first_name"],
                    'last_name': user_info["last_name"],
                    'full_name': user_info["full_name"],
                    'updated_at': 'now()',
                    'last_login': 'now()'
                }).execute()
                
                print("User synced to Supabase:", result.data)
                
            except Exception as supabase_error:
                print(f"Failed to sync user to Supabase: {supabase_error}")
                # Don't fail the request if Supabase sync fails
                pass
            
            return user_info
            
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail="Failed to fetch user data from Clerk"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user info: {str(e)}"
        )

# NEW: Example endpoints showing different database operations
@router.post("/coverletter-context")
async def save_cover_letter_context(
    context_data: dict,
    auth_context: dict = Depends(get_auth_context)
):
    """Save cover letter context to Supabase"""
    
    supabase = auth_context["supabase"]
    user_id = auth_context["user_id"]
    
    try:
        # First, ensure user exists in users table
        user_result = supabase.table('users').upsert({
            'id': user_id,
            'updated_at': 'now()'
        }, on_conflict='id').execute()
        
        print(f"User upsert result: {user_result.data}")
        
        # Insert cover letter context
        result = supabase.table('cover_letter_contexts').insert({
            'user_id': user_id,
            'context_data': context_data,
            'created_at': 'now()'
        }).execute()
        
        print(f"Context insert result: {result.data}")
        
        return {
            "message": "Context saved successfully",
            "data": result.data
        }
        
    except Exception as e:
        print(f"Detailed error: {str(e)}")
        print(f"Error type: {type(e)}")
        
        # Try with service role key as fallback
        try:
            admin_client = supabase_service.get_admin_client()
            
            # Ensure user exists
            admin_client.table('users').upsert({
                'id': user_id,
                'updated_at': 'now()'
            }, on_conflict='id').execute()
            
            # Insert context with admin privileges
            result = admin_client.table('cover_letter_contexts').insert({
                'user_id': user_id,
                'context_data': context_data,
                'created_at': 'now()'
            }).execute()
            
            return {
                "message": "Context saved successfully (admin fallback)",
                "data": result.data
            }
            
        except Exception as admin_error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save context: {str(e)} | Admin fallback error: {str(admin_error)}"
            )


@router.get("/coverletter-contexts")
async def get_cover_letter_contexts(auth_context: dict = Depends(get_auth_context)):
    """Get user's cover letter contexts from Supabase"""
    
    supabase = auth_context["supabase"]
    user_id = auth_context["user_id"]
    
    try:
        result = supabase.table('cover_letter_contexts')\
            .select('*')\
            .eq('user_id', user_id)\
            .order('created_at', desc=True)\
            .execute()
        
        return {
            "contexts": result.data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch contexts: {str(e)}"
        )

@router.put("/user-profile")
async def update_user_profile(
    profile_data: dict,
    auth_context: dict = Depends(get_auth_context)
):
    """Update user profile in Supabase"""
    
    supabase = auth_context["supabase"]
    user_id = auth_context["user_id"]
    
    try:
        result = supabase.table('users')\
            .update(profile_data)\
            .eq('id', user_id)\
            .execute()
        
        return {
            "message": "Profile updated successfully",
            "data": result.data
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.delete("/coverletter-context/{context_id}")
async def delete_cover_letter_context(
    context_id: str,
    auth_context: dict = Depends(get_auth_context)
):
    """Delete a cover letter context"""
    
    supabase = auth_context["supabase"]
    user_id = auth_context["user_id"]
    
    try:
        # Ensure user can only delete their own contexts
        result = supabase.table('cover_letter_contexts')\
            .delete()\
            .eq('id', context_id)\
            .eq('user_id', user_id)\
            .execute()
        
        return {
            "message": "Context deleted successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete context: {str(e)}"
        )

# NEW: Example of using raw SQL with Supabase (for complex queries)
@router.get("/analytics")
async def get_user_analytics(auth_context: dict = Depends(get_auth_context)):
    """Get user analytics using raw SQL"""
    
    supabase = auth_context["supabase"]
    user_id = auth_context["user_id"]
    
    try:
        # Example of using RPC (stored procedure) for complex analytics
        result = supabase.rpc('get_user_analytics', {
            'user_id_param': user_id
        }).execute()
        
        return {
            "analytics": result.data
        }
        
    except Exception as e:
        # Fallback to simple query if RPC doesn't exist
        try:
            result = supabase.table('cover_letter_contexts')\
                .select('id, created_at')\
                .eq('user_id', user_id)\
                .execute()
            
            return {
                "analytics": {
                    "total_contexts": len(result.data),
                    "contexts": result.data
                }
            }
        except Exception as fallback_error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to get analytics: {str(fallback_error)}"
            )