from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from mangum import Mangum

from tweak.service import Service
from tweak.coverletter.schemas import CoverLetterRequestSchema, CoverLetterResponseSchemaSerializable

app = FastAPI(title="Tweak API", json_encoder=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tweakleaf.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = Service()

@app.get("/tweak/health")
def health():
    return {
        "status": "tweak"
    }

@app.post("/tweak/coverletter")
async def tweak_coverletter(data: CoverLetterRequestSchema) -> CoverLetterResponseSchemaSerializable:
    return service.start_tweaking_coverletter(data)

@app.get("/tweak/coverletter/messages")
async def get_coverletter_messages(thread_id: str):
    """Get messages for a specific thread ID."""
    if not thread_id:
        raise HTTPException(status_code=400, detail="thread_id is required")
    
    messages = service.get_coverletter_messages(thread_id)
    return {"messages": messages, "thread_id": thread_id}

# Create handler for AWS Lambda with specific configuration
handler = Mangum(app, api_gateway_base_path=None, lifespan="off")
