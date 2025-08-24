
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any
from .service import ClerkService

router = APIRouter()
clerk_service = ClerkService()
security = HTTPBearer()

@router.get("/health")
def health() -> bool:
    return True

@router.get("/user")
async def get_user_info(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get current user information from Clerk
    """
    try:
        user_info = await clerk_service.verify_session_token(credentials)
        print("user_info ⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔⛔", user_info)
        return {"success": True, "user": user_info}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/update-context")
async def update_user_context(
    context_data: Dict[str, Any],
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Update user context (placeholder for Supabase operations)
    """
    try:
        user_info = await clerk_service.verify_session_token(credentials)
        user_id = user_info["user_id"]
        
        result = await clerk_service.update_user_context(user_id, context_data)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/protected")
async def protected_endpoint(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Example protected endpoint that requires Clerk authentication
    """
    try:
        user_info = await clerk_service.verify_session_token(credentials)
        return {
            "success": True,
            "message": "Access granted to protected endpoint",
            "user": user_info
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.get("/debug-token")
async def debug_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Debug endpoint to see what's in the JWT token without verification
    """
    try:
        import jwt
        token = credentials.credentials
        
        # Decode without verification to see the payload
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        
        return {
            "success": True,
            "token_preview": f"{token[:50]}...",
            "token_length": len(token),
            "unverified_payload": unverified_payload
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "token_preview": credentials.credentials[:50] if credentials.credentials else "No token"
        }
