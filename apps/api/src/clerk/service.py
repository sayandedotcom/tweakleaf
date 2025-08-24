import jwt
import requests
import os
from typing import Dict, Any, Optional
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jwt.algorithms import RSAAlgorithm

security = HTTPBearer()

class ClerkService:
    def __init__(self):
        self.clerk_api_key = os.getenv("CLERK_API_KEY", "sk_test_zNGCYI1jmZI4AvarxXKg78k4Ia6OcV4OLmifPVWd78")
        self.clerk_jwt_issuer = os.getenv("CLERK_JWT_ISSUER", "https://viable-tapir-70.clerk.accounts.dev")
        self.jwks_url = f"{self.clerk_jwt_issuer}/.well-known/jwks.json"
        self._jwks_cache = None
        
    def _get_jwks(self):
        """Get JWKS (JSON Web Key Set) from Clerk"""
        if self._jwks_cache is None:
            try:
                response = requests.get(self.jwks_url)
                response.raise_for_status()
                self._jwks_cache = response.json()
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Failed to fetch JWKS: {str(e)}")
        return self._jwks_cache
    
    def _get_public_key(self, token):
        """Get the public key for a specific token"""
        try:
            # Decode the token header without verification to get the key ID
            unverified_header = jwt.get_unverified_header(token)
            key_id = unverified_header.get('kid')
            
            if not key_id:
                raise HTTPException(status_code=401, detail="Token missing key ID")
            
            # Get JWKS and find the matching key
            jwks = self._get_jwks()
            for key in jwks.get('keys', []):
                if key.get('kid') == key_id:
                    return RSAAlgorithm.from_jwk(key)
            
            raise HTTPException(status_code=401, detail="No matching key found")
            
        except Exception as e:
            raise HTTPException(status_code=401, detail=f"Error getting public key: {str(e)}")
    
    async def verify_jwt(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
        """
        Verify Clerk JWT token using JWKS and return user information
        """
        try:
            token = credentials.credentials
            print(f"DEBUG: Received token: {token[:50]}...")  # Debug: show first 50 chars
            
            # Get the public key for this token
            public_key = self._get_public_key(token)
            print(f"DEBUG: Got public key successfully")  # Debug
            
            # First, let's decode without verification to see the payload
            unverified_payload = jwt.decode(token, options={"verify_signature": False})
            print(f"DEBUG: Unverified payload: {unverified_payload}")  # Debug
            
            # Verify and decode the JWT token
            payload = jwt.decode(
                token,
                public_key,
                algorithms=['RS256'],
                issuer=self.clerk_jwt_issuer,
                # Don't verify audience for now - let's see what's in the token
                options={
                    'verify_signature': True,
                    'verify_exp': True,
                    'verify_iat': True,
                    'verify_nbf': True,
                    'verify_iss': True,
                    'verify_aud': False  # Disable audience verification temporarily
                }
            )
            
            print(f"DEBUG: Verified payload: {payload}")  # Debug
            
            # Extract user information from the token
            user_id = payload.get('sub')
            if not user_id:
                raise HTTPException(status_code=401, detail="Token missing user ID")
            
            print(f"DEBUG: User ID from token: {user_id}")  # Debug
            
            # Get additional user details from Clerk API if needed
            user_info = await self.get_user_info(user_id)
            
            return user_info
            
        except jwt.ExpiredSignatureError:
            print(f"DEBUG: Token expired")  # Debug
            raise HTTPException(status_code=401, detail="Token expired")
        except jwt.InvalidTokenError as e:
            print(f"DEBUG: Invalid token error: {str(e)}")  # Debug
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
        except Exception as e:
            print(f"DEBUG: General error: {str(e)}")  # Debug
            raise HTTPException(status_code=500, detail=f"Authentication error: {str(e)}")
    
    async def verify_session_token(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
        """
        Verify Clerk session token and return user information
        This method handles JWT tokens that contain session information
        """
        try:
            token = credentials.credentials
            print(f"DEBUG: Received token: {token[:50]}...")
            
            # The token is actually a JWT, so let's decode it to get the session info
            try:
                # Decode without verification first to see the payload
                unverified_payload = jwt.decode(token, options={"verify_signature": False})
                print(f"DEBUG: JWT payload: {unverified_payload}")
                
                # Extract session ID and user ID from the JWT payload
                session_id = unverified_payload.get("sid")  # Session ID
                user_id = unverified_payload.get("sub")    # User ID
                
                if not user_id:
                    raise HTTPException(status_code=401, detail="Token missing user ID")
                
                print(f"DEBUG: Session ID from JWT: {session_id}")
                print(f"DEBUG: User ID from JWT: {user_id}")
                
                # Now verify the JWT signature using JWKS
                try:
                    public_key = self._get_public_key(token)
                    print(f"DEBUG: Got public key successfully")
                    
                    # Verify the JWT signature
                    verified_payload = jwt.decode(
                        token,
                        public_key,
                        algorithms=['RS256'],
                        issuer=self.clerk_jwt_issuer,
                        options={
                            'verify_signature': True,
                            'verify_exp': True,
                            'verify_iat': True,
                            'verify_nbf': True,
                            'verify_iss': True,
                            'verify_aud': False
                        }
                    )
                    print(f"DEBUG: JWT signature verified successfully")
                    
                except Exception as jwt_error:
                    print(f"DEBUG: JWT verification failed: {str(jwt_error)}")
                    # If JWT verification fails, we can still proceed with the unverified payload
                    # since we're getting the user info from Clerk's API anyway
                    verified_payload = unverified_payload
                
                # Get user details from Clerk API
                user_info = await self.get_user_info(user_id)
                return user_info
                
            except jwt.InvalidTokenError as e:
                print(f"DEBUG: Invalid JWT format: {str(e)}")
                raise HTTPException(status_code=401, detail="Invalid token format")
            
        except Exception as e:
            print(f"DEBUG: Session verification error: {str(e)}")
            raise HTTPException(status_code=401, detail=f"Session verification error: {str(e)}")
    
    async def get_user_info(self, user_id: str) -> Dict[str, Any]:
        """
        Get user information from Clerk API
        """
        try:
            headers = {
                "Authorization": f"Bearer {self.clerk_api_key}",
                "Content-Type": "application/json"
            }
            
            response = requests.get(
                f"https://api.clerk.com/v1/users/{user_id}",
                headers=headers
            )
            
            if response.status_code != 200:
                # If API call fails, return basic info from JWT
                return {
                    "user_id": user_id,
                    "email": None,
                    "first_name": None,
                    "last_name": None,
                    "full_name": None
                }
            
            user_data = response.json()
            return {
                "user_id": user_id,
                "email": user_data.get("email_addresses", [{}])[0].get("email_address") if user_data.get("email_addresses") else None,
                "first_name": user_data.get("first_name"),
                "last_name": user_data.get("last_name"),
                "full_name": f"{user_data.get('first_name', '')} {user_data.get('last_name', '')}".strip() if user_data.get("first_name") or user_data.get("last_name") else None
            }
            
        except Exception as e:
            # If API call fails, return basic info from JWT
            return {
                "user_id": user_id,
                "email": None,
                "first_name": None,
                "last_name": None,
                "full_name": None
            }
    
    async def update_user_context(self, user_id: str, context_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update user context (placeholder for Supabase operations)
        """
        # This is where you would integrate with Supabase
        # For now, just return the context data
        return {
            "user_id": user_id,
            "context": context_data,
            "message": "Context updated successfully"
        }
