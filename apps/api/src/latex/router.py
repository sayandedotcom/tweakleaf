from fastapi import APIRouter, Form, File, UploadFile
import logging
from src.services.latex_compiler import LatexCompilerService

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter()

# Create an instance of the service
latex_service = LatexCompilerService()

@router.post("/compile")
async def compile_latex(
    latex_content: str = Form(...),
    compiler: str = Form("pdflatex"),
    signature_image: UploadFile = File(None)
):
    """Compile LaTeX content to PDF using the LaTeX compiler service"""
    return await latex_service.compile_latex_to_pdf(
        latex_content=latex_content,
        compiler=compiler,
        signature_image=signature_image
    )

@router.get("/health")
def latex_health():
    """Health check for LaTeX service"""
    return latex_service.get_health_status()

@router.get("/status")
def latex_status():
    """Detailed status of LaTeX service"""
    return latex_service.get_detailed_status()