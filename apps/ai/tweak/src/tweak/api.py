from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum

from tweak.coverletter.service import CoverLetterService
from tweak.coverletter.schemas import CoverLetterRequestSchema, CoverLetterResponseSchemaSerializable

from tweak.resumes.service import ResumeService
from tweak.resumes.schemas import ResumeRequestSchema, ResumeResponseSchemaSerializable

app = FastAPI(title="Tweak API", json_encoder=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tweakleaf.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

coverletter_service = CoverLetterService()
resume_service = ResumeService()

@app.get("/tweak/health")
def health():
    return {
        "status": "tweak"
    }

@app.post("/tweak/coverletter")
async def tweak_coverletter(data: CoverLetterRequestSchema) -> CoverLetterResponseSchemaSerializable:
    return coverletter_service.start_tweaking_coverletter(data)

@app.get("/tweak/coverletter/messages")
async def get_coverletter_messages(thread_id: str):
    """Get messages for a specific thread ID."""
    if not thread_id:
        raise HTTPException(status_code=400, detail="thread_id is required")
    
    messages = coverletter_service.get_coverletter_messages(thread_id)
    return {"messages": messages, "thread_id": thread_id}

@app.post("/tweak/resume")
async def tweak_resume(data: ResumeRequestSchema) -> ResumeResponseSchemaSerializable:
    return resume_service.start_tweaking_resume(data)

@app.get("/tweak/resume/messages")
async def get_resume_messages(thread_id: str):
    """Get messages for a specific thread ID."""
    if not thread_id:
        raise HTTPException(status_code=400, detail="thread_id is required")
    
    messages = resume_service.get_resume_messages(thread_id)
    return {"messages": messages, "thread_id": thread_id}

# Create handler for AWS Lambda with specific configuration
handler = Mangum(app, api_gateway_base_path=None, lifespan="off")
