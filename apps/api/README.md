# Tweak.jobs API

This is the FastAPI backend for the Tweak.jobs application.

## Features

- **LaTeX Compilation Service**: Compile LaTeX documents to PDF using pdflatex
- **Cover Letter Generation**: Create professional cover letters from LaTeX templates
- **PDF Generation**: Convert LaTeX content to downloadable PDF files

## Setup

### Prerequisites

1. **LaTeX Installation**: The service requires pdflatex to be installed on the system

   ```bash
   sudo apt update
   sudo apt install texlive-latex-base texlive-fonts-recommended texlive-latex-extra
   ```

2. **Python Dependencies**: Install required Python packages

   ```bash
   pip install -r requirements.txt
   ```

### Environment Variables

Create a `.env` file in the `apps/api` directory:

```env
APP_NAME=Tweak.jobs API
NEXT_PUBLIC_API_URL=http://localhost:7000
```

## Running the API

```bash
cd apps/api
uvicorn app:app --reload --host 0.0.0.0 --port 7000
```

## API Endpoints

### LaTeX Service

- `GET /latex/health` - Health check for LaTeX service
- `GET /latex/status` - Detailed status of LaTeX compilation service
- `POST /latex/compile` - Compile LaTeX content to PDF

#### Compile LaTeX to PDF

**Endpoint**: `POST /latex/compile`

**Request Body**:

```json
{
  "latex_content": "\\documentclass{article}\\begin{document}Hello World\\end{document}"
}
```

**Response**: PDF file with `application/pdf` content type

## Frontend Integration

The frontend uses TanStack Query to communicate with the API:

1. **LaTeX Editor** (`cover-letter-latex.tsx`): Input LaTeX content and trigger compilation
2. **PDF Viewer** (`cover-letter-pdf.tsx`): Display the compiled PDF using react-pdf
3. **Custom Hook** (`use-latex-compilation.ts`): Handle API communication and state management

## Workflow

1. User writes LaTeX content in the editor
2. Frontend sends LaTeX content to `/latex/compile` endpoint
3. FastAPI creates temporary directory and runs pdflatex
4. Generated PDF is returned to frontend
5. Frontend displays PDF in the viewer component
6. User can download or view the PDF

## Error Handling

- **Service Unavailable**: Returns 503 if pdflatex is not installed
- **Compilation Errors**: Returns 400 with detailed error messages
- **Timeout**: 30-second timeout for LaTeX compilation
- **Frontend**: Toast notifications for success/error states

## Security Notes

- Temporary files are automatically cleaned up
- Input validation on LaTeX content
- Timeout protection against long-running processes
