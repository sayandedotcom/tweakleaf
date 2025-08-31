# LaTeX Service Deployment Guide

This guide will help you deploy the LaTeX compilation service to AWS Lambda using SST.

## 🚀 Quick Start

### Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **SST CLI installed**: `npm install -g sst`
3. **Docker running** (for local testing)
4. **Node.js 18+** and **pnpm**

### Deployment Steps

1. **Build the deployment package**:

   ```bash
   cd apps/ai/latex
   ./build.sh
   ```

2. **Deploy to development**:

   ```bash
   cd apps/ai
   sst deploy --stage dev
   ```

3. **Deploy to production**:

   ```bash
   sst deploy --stage production
   ```

## 🏗️ Architecture

The LaTeX service is deployed as an AWS Lambda function with:

- **Runtime**: Python 3.11
- **Memory**: 2048 MB (for LaTeX compilation)
- **Timeout**: 5 minutes
- **Handler**: `latex/src/latex/api.handler`

## 📦 Dependencies

### Python Dependencies

- `fastapi` - Web framework
- `mangum` - AWS Lambda adapter
- `python-multipart` - File upload handling

### LaTeX Dependencies

- `pdflatex` and `xelatex` compilers
- Custom fonts in `OpenFonts/` directory
- `cover.cls` template file

## 🔧 Configuration

### SST Configuration (`sst.config.ts`)

```typescript
const latex = new sst.aws.Function("LatexApi", {
  handler: "latex/src/latex/api.handler",
  runtime: "python3.11",
  url: true,
  timeout: "5 minutes",
  memory: "2048 MB",
  copyFiles: [
    { from: "latex/src/latex/cover.cls", to: "latex/src/latex/cover.cls" },
    { from: "latex/src/latex/OpenFonts", to: "latex/src/latex/OpenFonts" },
  ],
});
```

### Environment Variables

- `TEXMFHOME` - LaTeX user directory
- `TEXMFCONFIG` - LaTeX configuration directory
- `TEXMFVAR` - LaTeX variable directory

## 🐳 Docker Alternative

If you want to use Docker for the heavy LaTeX dependencies, you can:

1. **Build a custom container** with LaTeX pre-installed
2. **Use AWS Lambda Container Images** (requires SST v3+)
3. **Deploy as an ECS service** instead of Lambda

## 📊 Monitoring

### CloudWatch Logs

- Function logs: `/aws/lambda/ai-dev-LatexApi`
- API Gateway logs: `/aws/apigateway/`

### Health Endpoints

- `GET /health` - Basic health check
- `GET /status` - Detailed service status
- `GET /` - API information

## 🚨 Troubleshooting

### Common Issues

1. **LaTeX not found**: Ensure LaTeX is installed in the Lambda environment
2. **Memory issues**: Increase memory allocation for large documents
3. **Timeout errors**: Increase timeout for complex LaTeX compilation
4. **Font issues**: Verify custom fonts are properly copied

### Debug Commands

```bash
# Check SST status
sst status --stage dev

# View logs
sst logs --stage dev

# Remove deployment
sst remove --stage dev
```

## 🔄 CI/CD

### GitHub Actions Example

```yaml
- name: Deploy to AWS
  run: |
    cd apps/ai
    sst deploy --stage production
```

### Environment Variables

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_DEFAULT_REGION`

## 📚 Resources

- [SST Documentation](https://sst.dev/)
- [AWS Lambda Python](https://docs.aws.amazon.com/lambda/latest/dg/python-programming-model.html)
- [FastAPI on Lambda](https://fastapi.tiangolo.com/deployment/serverless/)
- [Mangum Documentation](https://mangum.io/)

## 🆘 Support

If you encounter issues:

1. Check the CloudWatch logs
2. Verify the deployment package structure
3. Test locally with `sst dev`
4. Check AWS Lambda console for function status
