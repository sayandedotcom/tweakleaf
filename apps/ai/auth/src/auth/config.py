import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
    CLERK_ISSUER = os.getenv("CLERK_ISSUER")
