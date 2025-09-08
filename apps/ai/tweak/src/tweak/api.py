from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from mangum import Mangum

from tweak.service import Service
from tweak.coverletter.schemas import CoverLetterRequestSchema, CoverLetterResponseSchema

app = FastAPI(title="Tweak API", json_encoder=None)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tweak.sayande.com"],
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
async def tweak_coverletter(data: CoverLetterRequestSchema) -> CoverLetterResponseSchema:
    return service.start_tweaking_coverletter(data)

# Create handler for AWS Lambda with specific configuration
handler = Mangum(app, api_gateway_base_path=None, lifespan="off")
