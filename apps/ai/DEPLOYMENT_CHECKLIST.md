# 🚀 LaTeX Service Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Environment Setup

- [ ] AWS CLI configured with appropriate permissions
- [ ] SST CLI installed: `npm install -g sst`
- [ ] Docker running (for local testing)
- [ ] Node.js 18+ and pnpm installed
- [ ] Python 3.11+ with virtual environment

### 2. Code Verification

- [ ] LaTeX service code migrated from `latex_compiler.py` to `service.py`
- [ ] API handler (`api.py`) properly configured
- [ ] All dependencies listed in `requirements.txt`
- [ ] LaTeX files (`cover.cls`, `OpenFonts/`) present
- [ ] Build script (`build.sh`) executable

### 3. Local Testing

- [ ] Install dependencies: `pip install -r requirements.txt`
- [ ] Test API locally: `python test_local.py`
- [ ] Verify health endpoint: `curl http://localhost:8000/health`
- [ ] Check status endpoint: `curl http://localhost:8000/status`

## 🚀 Deployment Steps

### Step 1: Build Package

```bash
cd apps/ai/latex
./build.sh
```

**Expected Output**: `✅ Build complete! Deployment package: latex-lambda.zip`

### Step 2: Deploy to Development

```bash
cd apps/ai
sst deploy --stage dev
```

**Expected Output**: Success message with API endpoints

### Step 3: Verify Deployment

```bash
# Check function status
sst status --stage dev

# View logs
sst logs --stage dev

# Test endpoints
curl <your-api-url>/health
curl <your-api-url>/status
```

### Step 4: Deploy to Production

```bash
sst deploy --stage production
```

## 🔧 Configuration Files

### SST Config (`sst.config.ts`)

- ✅ Function name: `LatexApi`
- ✅ Handler: `latex/src/latex/api.handler`
- ✅ Runtime: `python3.11`
- ✅ Memory: `2048 MB`
- ✅ Timeout: `5 minutes`
- ✅ Copy files configured

### Requirements (`requirements.txt`)

- ✅ `fastapi>=0.104.0`
- ✅ `mangum>=0.17.0`
- ✅ `python-multipart>=0.0.6`
- ✅ `uvicorn>=0.24.0`

### LaTeX Files

- ✅ `cover.cls` template
- ✅ `OpenFonts/` directory with fonts
- ✅ Service layer (`service.py`)
- ✅ API layer (`api.py`)

## 🚨 Common Issues & Solutions

### Issue: LaTeX not found in Lambda

**Solution**: Ensure LaTeX is available in the Lambda environment

- Use Lambda layers with LaTeX
- Consider container-based deployment

### Issue: Memory/timeout errors

**Solution**: Increase Lambda configuration

- Memory: 2048 MB → 4096 MB
- Timeout: 5 minutes → 15 minutes

### Issue: Font files not found

**Solution**: Verify file copying

- Check `copyFiles` configuration
- Verify file paths in deployment package

### Issue: Import errors

**Solution**: Check dependencies

- Verify `requirements.txt`
- Check Python path configuration

## 📊 Post-Deployment Verification

### Health Check

```bash
curl <api-url>/health
# Expected: {"status": "healthy", "message": "LaTeX service is running"}
```

### Status Check

```bash
curl <api-url>/status
# Expected: Detailed service status with compiler availability
```

### Compilation Test

```bash
curl -X POST <api-url>/compile \
  -F "latex_content=\documentclass{article}\begin{document}Hello World\end{document}" \
  -F "compiler=pdflatex"
# Expected: PDF file download
```

## 🔄 Monitoring & Maintenance

### CloudWatch Logs

- Function logs: `/aws/lambda/ai-dev-LatexApi`
- API Gateway logs: `/aws/apigateway/`

### Performance Metrics

- Invocation count
- Duration
- Error rate
- Memory usage

### Regular Checks

- [ ] Weekly health check
- [ ] Monthly performance review
- [ ] Quarterly dependency updates

## 📞 Support Resources

- **SST Documentation**: <https://sst.dev/>
- **AWS Lambda**: <https://docs.aws.amazon.com/lambda/>
- **FastAPI**: <https://fastapi.tiangolo.com/>
- **Mangum**: <https://mangum.io/>

---

**Last Updated**: $(date)
**Version**: 1.0.0
