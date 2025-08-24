import os
from dotenv import load_dotenv

load_dotenv()

# Hard code this cursor for now
class Config:
    CLERK_JWKS_URL = "https://viable-tapir-70.clerk.accounts.dev/.well-known/jwks.json"
    CLERK_ISSUER = "https://viable-tapir-70.clerk.accounts.dev"
