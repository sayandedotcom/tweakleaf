from fastapi import APIRouter

router = APIRouter()

@router.get("/coverletter")
def health():
    return {
        "status": "coverletter"
    }


