from fastapi import FastAPI, Form, File, UploadFile
import logging
from latex.service import LatexCompilerService
from mangum import Mangum

# Set up logging for Lambda
logging.basicConfig(level=logging.INFO)  # Use INFO level for Lambda to reduce logs
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="LaTeX Compilation API", version="1.0.0")

# Create an instance of the service (initialized once per Lambda container)
latex_service = LatexCompilerService()

@app.post("/compile")
async def compile_latex(
    latex_content: str = Form(...),
    compiler: str = Form("xelatex"),  # Default to xelatex since it's more feature-rich
    signature_image: UploadFile = File(None)
):
    """Compile LaTeX content to PDF using the LaTeX compiler service"""
    logger.info(f"Received compilation request with compiler: {compiler}")
    return await latex_service.compile_latex_to_pdf(
        latex_content=latex_content,
        compiler=compiler,
        signature_image=signature_image
    )

@app.get("/health")
def latex_health():
    """Health check for LaTeX service"""
    return latex_service.get_health_status()

@app.get("/status")
def latex_status():
    """Detailed status of LaTeX service"""
    return latex_service.get_detailed_status()

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "LaTeX Compilation API",
        "version": "1.0.0",
        "endpoints": [
            "POST /compile - Compile LaTeX to PDF",
            "GET /health - Health check",
            "GET /status - Detailed status"
        ]
    }

# Create handler for AWS Lambda with specific configuration for binary responses
handler = Mangum(
    app, 
    api_gateway_base_path=None, 
    lifespan="off",
    # Enable binary media types for PDF responses
    custom_handlers={
        "application/pdf": lambda x: x
    }
)