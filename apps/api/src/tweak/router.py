from src.tweak.service import Service
from src.tweak.coverletter.schemas import CoverLetterRequestSchema, CoverLetterResponseSchema


from fastapi import APIRouter

router = APIRouter()

service = Service()

@router.get("/health")
def health() -> bool:
    return True

@router.post("/coverletter")
async def tweak_coverletter(data: CoverLetterRequestSchema) -> CoverLetterResponseSchema:
    return service.start_tweaking_coverletter(data)
