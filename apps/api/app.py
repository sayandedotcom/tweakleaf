from config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.latex.router import router as latex_router
from src.tweak.router import router as tweak_router
from src.clerk.router import router as clerk_router
from src.auth.dashboard import router as auth_router

from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Create a FastAPI app instance with the specified title from settings
app = FastAPI(title=settings.APP_NAME)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def healthcheck() -> bool:
    return True

app.include_router(latex_router, prefix="/latex", tags=["Latex"])
app.include_router(tweak_router, prefix="/tweak", tags=["Tweak"])
app.include_router(clerk_router, prefix="/clerk", tags=["Clerk"])
app.include_router(auth_router, prefix="/auth", tags=["Auth"])
