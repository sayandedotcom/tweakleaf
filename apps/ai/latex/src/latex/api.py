from fastapi import FastAPI, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import logging
from latex.service import LatexCompilerService

# Set up logging for EC2
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

@app.post("/latex/compile")
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

@app.get("/latex/health")
def latex_health():
    """Health check for LaTeX service"""
    return latex_service.get_health_status()

@app.get("/latex/status")
def latex_status():
    """Detailed status of LaTeX service"""
    return latex_service.get_detailed_status()

@app.get("/latex")
def root():
    """Root endpoint"""
    return {
        "message": "LaTeX Compilation API - Running on EC2",
        "version": "1.0.0",
        "endpoints": [
            "POST /latex/compile - Compile LaTeX to PDF",
            "GET /latex/health - Health check",
            "GET /latex/status - Detailed status"
        ]
    }

@app.get("/")
def api_root():
    """API Root endpoint"""
    return {
        "service": "LaTeX Compilation API",
        "status": "running",
        "deployment": "EC2"
    }

# For EC2 deployment, we don't need the Mangum handler
# The app will be run directly with uvicorn

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)