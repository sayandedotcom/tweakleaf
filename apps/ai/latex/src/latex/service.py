import subprocess
import tempfile
import shutil
import os
from pathlib import Path
from fastapi import HTTPException, UploadFile
from fastapi.responses import Response
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class LatexCompilerService:
    """Service class for LaTeX compilation operations - Lambda optimized"""
    
    def __init__(self):
        # Set up Lambda-specific environment
        self._setup_lambda_environment()
    
    def _setup_lambda_environment(self):
        """Set up environment variables and directories for Lambda"""
        # Set TeX environment variables for Lambda's writable /tmp directory
        os.environ['TEXMFHOME'] = '/tmp/.texlive/texmf'
        os.environ['TEXMFCONFIG'] = '/tmp/.texlive/texmf-config'
        os.environ['TEXMFVAR'] = '/tmp/.texlive/texmf-var'
        
        # Ensure directories exist
        Path('/tmp/.texlive').mkdir(parents=True, exist_ok=True)
        logger.info("Lambda environment setup complete")
    
    def check_latex_availability(self, compiler: str = "xelatex") -> bool:
        """Check if the specified LaTeX compiler is available on the system"""
        try:
            result = subprocess.run(
                [compiler, "--version"], 
                capture_output=True, 
                text=True, 
                timeout=5
            )
            return result.returncode == 0
        except (subprocess.TimeoutExpired, FileNotFoundError):
            return False
    
    def validate_compiler(self, compiler: str) -> None:
        """Validate that the compiler is supported"""
        if compiler not in ["pdflatex", "xelatex"]:
            raise HTTPException(status_code=400, detail="Invalid compiler. Must be 'pdflatex' or 'xelatex'")
    
    def validate_latex_content(self, latex_content: str) -> None:
        """Validate that LaTeX content is provided"""
        if not latex_content.strip():
            raise HTTPException(status_code=400, detail="LaTeX content cannot be empty")
    
    def copy_required_files(self, temp_path: Path) -> None:
        """Copy required LaTeX files to the temporary directory"""
        # In Lambda, files are copied to /var/task/ (the Lambda deployment package)
        # Since your files are in src/latex/, they'll be at /var/task/latex/ after deployment
        source_cls = Path("/var/task/latex/cover.cls")
        cls_file = temp_path / "cover.cls"
        
        if not source_cls.exists():
            # Fallback: try relative path (for local development)
            source_cls = Path("src/latex/cover.cls")
            if not source_cls.exists():
                logger.error(f"cover.cls not found at {source_cls} or /var/task/latex/cover.cls")
                raise HTTPException(status_code=500, detail="cover.cls file not found in deployment package")
        
        shutil.copy2(source_cls, cls_file)
        logger.info(f"Copied cover.cls from {source_cls} to: {cls_file}")
        logger.info(f"cover.cls exists: {cls_file.exists()}")
        logger.info(f"cover.cls size: {cls_file.stat().st_size} bytes")
        
        # Copy the entire OpenFonts directory structure to the temporary directory
        source_fonts = Path("/var/task/latex/OpenFonts")
        if not source_fonts.exists():
            # Fallback: try relative path (for local development)
            source_fonts = Path("src/latex/OpenFonts")
        
        if source_fonts.exists():
            fonts_dest = temp_path / "OpenFonts"
            shutil.copytree(source_fonts, fonts_dest)
            logger.info(f"Copied OpenFonts directory from {source_fonts} to: {fonts_dest}")
            logger.info(f"OpenFonts directory exists: {fonts_dest.exists()}")
            
            # Update font cache with custom fonts in Lambda
            try:
                subprocess.run(['fc-cache', '-fv', str(fonts_dest)], 
                             capture_output=True, text=True, timeout=10)
                logger.info("Updated font cache with custom fonts")
            except Exception as e:
                logger.warning(f"Failed to update font cache: {e}")
        else:
            logger.warning("OpenFonts directory not found, fonts may not be available")
    
    async def save_signature_image(self, signature_image: UploadFile, temp_path: Path) -> None:
        """Save signature image if provided"""
        if signature_image:
            signature_path = temp_path / "signature.png"
            with open(signature_path, "wb") as f:
                content = await signature_image.read()
                f.write(content)
            logger.info(f"Saved signature image to: {signature_path}")
    
    def create_latex_file(self, latex_content: str, temp_path: Path) -> Path:
        """Create the LaTeX file in the temporary directory"""
        latex_file = temp_path / "document.tex"
        with open(latex_file, "w", encoding="utf-8") as f:
            f.write(latex_content)
        
        logger.info(f"Created LaTeX file: {latex_file}")
        logger.info(f"LaTeX file size: {latex_file.stat().st_size} bytes")
        
        return latex_file
    
    def compile_latex(self, compiler: str, temp_dir: str, latex_file: Path) -> subprocess.CompletedProcess:
        """Run the LaTeX compiler command"""
        cmd = [
            compiler, 
            "-interaction=nonstopmode", 
            "-output-directory", temp_dir, 
            latex_file.name
        ]
        logger.info(f"Running command: {' '.join(cmd)}")
        
        # Set up environment for LaTeX compilation
        env = os.environ.copy()
        env.update({
            'TEXMFHOME': '/tmp/.texlive/texmf',
            'TEXMFCONFIG': '/tmp/.texlive/texmf-config',
            'TEXMFVAR': '/tmp/.texlive/texmf-var'
        })
        
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=temp_dir,
            timeout=60,  # Increased timeout for Lambda
            env=env
        )
        
        logger.info(f"{compiler} return code: {result.returncode}")
        if result.stdout:
            logger.info(f"{compiler} stdout: {result.stdout[-1000:]}")  # Log last 1000 chars
        if result.stderr:
            logger.error(f"{compiler} stderr: {result.stderr[-1000:]}")  # Log last 1000 chars
        
        return result
    
    def check_compilation_success(self, result: subprocess.CompletedProcess, temp_path: Path) -> Path:
        """Check if compilation was successful and return PDF file path"""
        pdf_file = temp_path / "document.pdf"
        logger.info(f"Checking for PDF file: {pdf_file}")
        logger.info(f"PDF file exists: {pdf_file.exists()}")
        
        if not pdf_file.exists():
            # Log the error details for debugging
            error_msg = f"LaTeX compilation failed. Return code: {result.returncode}"
            if result.stderr:
                error_msg += f"\nStderr: {result.stderr[-500:]}"  # Last 500 chars for Lambda logs
            if result.stdout:
                error_msg += f"\nStdout: {result.stdout[-500:]}"  # Last 500 chars for Lambda logs
            
            logger.error(error_msg)
            raise HTTPException(status_code=400, detail=error_msg)
        
        logger.info(f"PDF file created successfully: {pdf_file}")
        logger.info(f"PDF file size: {pdf_file.stat().st_size} bytes")
        
        return pdf_file
    
    def read_pdf_content(self, pdf_file: Path) -> bytes:
        """Read the PDF file content as bytes"""
        with open(pdf_file, "rb") as f:
            pdf_content = f.read()
        
        logger.info(f"Read PDF content: {len(pdf_content)} bytes")
        return pdf_content
    
    def create_pdf_response(self, pdf_content: bytes) -> Response:
        """Create the PDF response with proper headers"""
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=cover_letter.pdf",
                "Content-Length": str(len(pdf_content))
            }
        )
    
    async def compile_latex_to_pdf(
        self,
        latex_content: str,
        compiler: str = "pdflatex",
        signature_image: UploadFile | None = None
    ) -> Response:
        """Main method to compile LaTeX content to PDF"""
        logger.info("Starting LaTeX compilation")
        
        # Validate inputs
        self.validate_latex_content(latex_content)
        self.validate_compiler(compiler)
        
        # Check if the specified LaTeX compiler is available
        if not self.check_latex_availability(compiler):
            logger.error(f"{compiler} not available")
            raise HTTPException(
                status_code=503,
                detail=f"LaTeX compilation service is not available. {compiler} not found in Lambda environment"
            )
        
        logger.info(f"{compiler} is available, proceeding with compilation")
        
        # Create a temporary directory in /tmp (Lambda's writable directory)
        temp_dir = tempfile.mkdtemp(dir='/tmp')
        temp_path = Path(temp_dir)
        
        try:
            logger.info(f"Created temporary directory: {temp_dir}")
            
            # Copy required files
            self.copy_required_files(temp_path)
            
            # Save signature image if provided
            if signature_image:
                await self.save_signature_image(signature_image, temp_path)
            
            # Create the LaTeX file
            latex_file = self.create_latex_file(latex_content, temp_path)
            
            logger.info(f"cover.cls copied and LaTeX file created in temporary directory: {temp_dir}")
            
            # Compile LaTeX
            result = self.compile_latex(compiler, temp_dir, latex_file)
            
            # Check if compilation was successful
            pdf_file = self.check_compilation_success(result, temp_path)
            
            # Read PDF content
            pdf_content = self.read_pdf_content(pdf_file)
            
            # Return the PDF as bytes with proper headers
            return self.create_pdf_response(pdf_content)
            
        except subprocess.TimeoutExpired as e:
            logger.error(f"LaTeX compilation timed out: {e}")
            raise HTTPException(status_code=408, detail="LaTeX compilation timed out")
        except Exception as e:
            logger.error(f"Unexpected error during LaTeX compilation: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error compiling LaTeX: {str(e)}")
        finally:
            # Clean up temporary files manually
            try:
                shutil.rmtree(temp_dir)
                logger.info(f"Cleaned up temporary directory: {temp_dir}")
            except Exception as cleanup_error:
                logger.warning(f"Failed to clean up temporary directory: {cleanup_error}")
    
    def get_health_status(self) -> dict:
        """Get health check status for LaTeX service"""
        pdflatex_available = self.check_latex_availability("pdflatex")
        xelatex_available = self.check_latex_availability("xelatex")
        any_compiler_available = pdflatex_available or xelatex_available
        
        return {
            "message": "LaTeX service is running in Lambda",
            "pdflatex_available": pdflatex_available,
            "xelatex_available": xelatex_available,
            "any_compiler_available": any_compiler_available,
            "status": "healthy" if any_compiler_available else "degraded",
            "environment": "AWS Lambda"
        }
    
    def get_detailed_status(self) -> dict:
        """Get detailed status of LaTeX service"""
        pdflatex_available = self.check_latex_availability("pdflatex")
        xelatex_available = self.check_latex_availability("xelatex")
        
        status_info = {}
        
        if pdflatex_available:
            try:
                result = subprocess.run(["pdflatex", "--version"], capture_output=True, text=True, timeout=5)
                pdflatex_version = result.stdout.split('\n')[0] if result.stdout else "Unknown version"
            except Exception:
                pdflatex_version = "Version check failed"
            status_info["pdflatex"] = {"available": True, "version": pdflatex_version}
        else:
            status_info["pdflatex"] = {"available": False, "version": None}
        
        if xelatex_available:
            try:
                result = subprocess.run(["xelatex", "--version"], capture_output=True, text=True, timeout=5)
                xelatex_version = result.stdout.split('\n')[0] if result.stdout else "Unknown version"
            except Exception:
                xelatex_version = "Version check failed"
            status_info["xelatex"] = {"available": True, "version": xelatex_version}
        else:
            status_info["xelatex"] = {"available": False, "version": None}
        
        any_compiler_available = pdflatex_available or xelatex_available
        
        if any_compiler_available:
            return {
                "status": "available",
                "compilers": status_info,
                "message": "LaTeX compilation service is ready in Lambda environment",
                "environment": "AWS Lambda",
                "texmf_paths": {
                    "TEXMFHOME": os.environ.get('TEXMFHOME', 'Not set'),
                    "TEXMFCONFIG": os.environ.get('TEXMFCONFIG', 'Not set'),
                    "TEXMFVAR": os.environ.get('TEXMFVAR', 'Not set')
                }
            }
        else:
            return {
                "status": "unavailable",
                "compilers": status_info,
                "message": "No LaTeX compilers found in Lambda environment",
                "environment": "AWS Lambda"
            }