from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from tweak.router import router as tweak_router

from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Create a FastAPI app instance with the specified title from settings
app = FastAPI(title="Main AI API")

origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://tweak.sayande.com"
]

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/tweak/health")
async def healthcheck() -> bool:
    return True

app.include_router(tweak_router, prefix="/tweak", tags=["Tweak"])

# Create handler for AWS Lambda with specific configuration
handler = Mangum(app, lifespan="off")
# api_gateway_base_path=None