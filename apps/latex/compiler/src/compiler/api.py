from fastapi import FastAPI, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import logging
from compiler.service import LatexCompilerService
from mangum import Mangum

# Set up logging for Lambda
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Create FastAPI app
app = FastAPI(title="LaTeX Compilation API", version="1.0.0")

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

# Create an instance of the service
latex_service = LatexCompilerService()

@app.post("/compiler/compile")
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

@app.get("/compiler/health")
def latex_health():
    """Health check for LaTeX service"""
    return latex_service.get_health_status()

@app.get("/compiler/status")
def latex_status():
    """Detailed status of LaTeX service"""
    return latex_service.get_detailed_status()

@app.get("/compiler")
def root():
    """Root endpoint"""
    return {
        "message": "LaTeX Compilation API - Running on Lambda",
        "version": "1.0.0",
        "endpoints": [
            "POST /compiler/compile - Compile LaTeX to PDF",
            "GET /compiler/health - Health check",
            "GET /compiler/status - Detailed status"
        ]
    }

@app.get("/")
def api_root():
    """API Root endpoint"""
    return {
        "service": "LaTeX Compilation API",
        "status": "running",
        "deployment": "Lambda"
    }

# Lambda handler - this is what SST will use
handler = Mangum(app, api_gateway_base_path=None, lifespan="off")
