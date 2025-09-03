/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "ai",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
        // "@pulumiverse/vercel": "3.2.1",
      },
    };
  },
  async run() {
    // Security group for LaTeX FastAPI service
    const securityGroup = new aws.ec2.SecurityGroup("latex-api-secgrp", {
      description: "Security group for LaTeX FastAPI service",
      ingress: [
        {
          description: "FastAPI HTTP",
          protocol: "tcp",
          fromPort: 8000,
          toPort: 8000,
          cidrBlocks: ["0.0.0.0/0"],
        },
        {
          description: "HTTP for status page",
          protocol: "tcp",
          fromPort: 80,
          toPort: 80,
          cidrBlocks: ["0.0.0.0/0"],
        },
        {
          description: "SSH access",
          protocol: "tcp",
          fromPort: 22,
          toPort: 22,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
      egress: [
        {
          description: "All outbound traffic",
          protocol: "-1",
          fromPort: 0,
          toPort: 0,
          cidrBlocks: ["0.0.0.0/0"],
        },
      ],
    });
    // Use Ubuntu 22.04 LTS
    const ami = aws.ec2.getAmi({
      filters: [
        {
          name: "name",
          values: ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"],
        },
      ],
      mostRecent: true,
      owners: ["099720109477"], // Canonical
    });
    // Simplified user data script - Python 3.10, 20GB storage, minimal LaTeX
    const userData = `#!/bin/bash
# Update system
apt-get update -y
apt-get upgrade -y

# Install system dependencies (using Ubuntu's default Python 3.10)
apt-get install -y software-properties-common git curl wget build-essential
apt-get install -y python3 python3-dev python3-venv python3-pip

# Install minimal LaTeX (saves ~3GB compared to texlive-full)
apt-get install -y texlive-latex-base texlive-xetex texlive-fonts-recommended texlive-latex-extra

# Create app directory
mkdir -p /app
cd /app

# Clone your repository
git clone https://github.com/sayandedotcom/tweak.jobs.git
cd tweak.jobs/apps/ai/latex

# Create virtual environment using Python 3.10
python3 -m venv .venv

# Activate virtual environment and install dependencies
source .venv/bin/activate

# Install FastAPI dependencies using pip
pip install fastapi uvicorn python-multipart python-dotenv

# If you have a pyproject.toml, install the project
if [ -f "pyproject.toml" ]; then
    pip install -e .
fi

# Create startup script
cat > /app/start_latex_api.sh << 'EOF'
#!/bin/bash
cd /app/tweak.jobs/apps/ai/latex
source .venv/bin/activate
export PYTHONPATH=/app/tweak.jobs/apps/ai/latex/src
python3 -m uvicorn src.latex.api:app --host 0.0.0.0 --port 8000
EOF

chmod +x /app/start_latex_api.sh

# Create systemd service
cat > /etc/systemd/system/latex-api.service << 'EOF'
[Unit]
Description=LaTeX FastAPI Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/app/tweak.jobs/apps/ai/latex
Environment=PYTHONPATH=/app/tweak.jobs/apps/ai/latex/src
ExecStart=/app/start_latex_api.sh
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Change ownership to ubuntu user
chown -R ubuntu:ubuntu /app

# Enable and start the service
systemctl daemon-reload
systemctl enable latex-api
systemctl start latex-api

# Create status page
cat > /app/status.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>LaTeX API - Python 3.10 + 20GB</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, sans-serif; 
            line-height: 1.6; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container { 
            max-width: 1000px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { 
            color: #2c3e50; 
            font-size: 2.5em; 
            margin-bottom: 10px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .status-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
            margin: 30px 0; 
        }
        .status-card { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 25px; 
            border-radius: 15px; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .status-card h3 { margin-bottom: 15px; font-size: 1.3em; }
        .fix-highlight {
            background: linear-gradient(45deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .endpoints { display: grid; gap: 15px; margin: 30px 0; }
        .endpoint { 
            background: #f8f9fa; 
            padding: 20px; 
            border-left: 4px solid #667eea;
            border-radius: 10px;
            transition: transform 0.2s;
        }
        .endpoint:hover { transform: translateX(5px); }
        .endpoint strong { color: #667eea; }
        .endpoint code { 
            background: #e9ecef; 
            padding: 8px 12px; 
            border-radius: 5px; 
            font-family: 'Monaco', 'Consolas', monospace;
            display: inline-block;
            margin: 5px 0;
        }
        .commands { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 25px; 
            border-radius: 15px; 
            font-family: 'Monaco', 'Consolas', monospace;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 LaTeX API - SIMPLIFIED</h1>
            <p>Python 3.10 + 20GB Storage + Minimal LaTeX</p>
        </div>
        
        <div class="fix-highlight">
            <h3>✅ Final Configuration</h3>
            <p><strong>Python:</strong> 3.10 (Ubuntu default - no PPA issues) • <strong>Storage:</strong> 20GB EBS • <strong>LaTeX:</strong> Minimal (~1GB vs 4GB) • <strong>Packages:</strong> Standard pip</p>
        </div>
        
        <div class="status-grid">
            <div class="status-card">
                <h3>🔥 Server Status</h3>
                <p><strong>FastAPI:</strong> Running on port 8000</p>
                <p><strong>Python:</strong> 3.10.12 (Ubuntu)</p>
                <p><strong>Package Manager:</strong> pip</p>
                <p><strong>LaTeX Engine:</strong> XeLaTeX (Minimal)</p>
            </div>
            <div class="status-card">
                <h3>📊 System Resources</h3>
                <p><strong>Instance:</strong> t3.medium</p>
                <p><strong>Storage:</strong> 20GB EBS gp3</p>
                <p><strong>LaTeX Size:</strong> ~1.2GB (optimized)</p>
                <p><strong>Free Space:</strong> ~15GB</p>
            </div>
        </div>

        <h2>🌐 API Endpoints</h2>
        <div class="endpoints">
            <div class="endpoint">
                <strong>GET</strong> <code>http://YOUR_IP:8000/</code><br>
                API Root - Service information
            </div>
            <div class="endpoint">
                <strong>POST</strong> <code>http://YOUR_IP:8000/latex/compile</code><br>
                Compile LaTeX to PDF (XeLaTeX support)
            </div>
            <div class="endpoint">
                <strong>GET</strong> <code>http://YOUR_IP:8000/latex/health</code><br>
                Health check endpoint
            </div>
            <div class="endpoint">
                <strong>GET</strong> <code>http://YOUR_IP:8000/docs</code><br>
                FastAPI interactive docs
            </div>
        </div>

        <h2>🔧 Verification Commands</h2>
        <div class="commands">
# Check Python version<br>
python3 --version<br>
which python3<br><br>

# Check disk space (should show ~15GB free)<br>
df -h<br><br>

# Check service status<br>
sudo systemctl status latex-api<br>
sudo journalctl -u latex-api -f --lines=20<br><br>

# Navigate to project<br>
cd /app/tweak.jobs/apps/ai/latex<br>
ls -la<br>
source .venv/bin/activate<br>
python -c "import fastapi, uvicorn; print('Dependencies OK')"<br><br>

# Test LaTeX compilation<br>
pdflatex --version<br>
xelatex --version
        </div>
    </div>
</body>
</html>
EOF

# Serve status page on port 80
cd /app
nohup python3 -m http.server 80 --directory /app > /dev/null 2>&1 &

# Detailed setup logging
echo "=== LaTeX API Setup Report - FINAL ===" > /app/setup.log
echo "Setup completed at: $(date)" >> /app/setup.log
echo "" >> /app/setup.log
echo "=== System Info ===" >> /app/setup.log
echo "Python version: $(python3 --version)" >> /app/setup.log
echo "Pip version: $(pip --version)" >> /app/setup.log
echo "Git version: $(git --version)" >> /app/setup.log
echo "" >> /app/setup.log
echo "=== Disk Usage ===" >> /app/setup.log
df -h >> /app/setup.log
echo "" >> /app/setup.log
echo "=== Directory Structure ===" >> /app/setup.log
ls -la /app/ >> /app/setup.log
ls -la /app/tweak.jobs/apps/ai/latex/ >> /app/setup.log
echo "" >> /app/setup.log
echo "=== Service Status ===" >> /app/setup.log
systemctl status latex-api >> /app/setup.log
echo "" >> /app/setup.log

# Final verification
sleep 5
if systemctl is-active --quiet latex-api; then
    echo "✅ SUCCESS: LaTeX API service is running" >> /app/setup.log
    echo "🌐 Access: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):8000" >> /app/setup.log
else
    echo "❌ FAILED: LaTeX API service did not start" >> /app/setup.log
    echo "=== Error Logs ===" >> /app/setup.log
    journalctl -u latex-api --no-pager -n 30 >> /app/setup.log
fi

echo "=== Setup Complete ===" >> /app/setup.log`;
    // Create EC2 instance with 20GB storage
    const server = new aws.ec2.Instance("latex-api-simplified", {
      instanceType: "t3.medium",
      ami: ami.then((ami) => ami.id),
      userData: userData,
      vpcSecurityGroupIds: [securityGroup.id],
      associatePublicIpAddress: true,
      // 20GB root volume (key fix for disk space)
      rootBlockDevice: {
        volumeSize: 20,
        volumeType: "gp3",
        deleteOnTermination: true,
      },
      tags: {
        Name: "LaTeX-API-Simplified-20GB",
        Python: "3.10-Ubuntu-Default",
        Storage: "20GB-EBS",
        LaTeX: "Minimal",
        Status: "Final-Version",
      },
    });

    const fastapi = new sst.aws.Function("FastAPI", {
      handler: "./functions/src/functions/api.handler",
      runtime: "python3.11",
      url: true,
    });

    const apiRouter = new sst.aws.Router("LaTeXAPIRouter", {
      domain: {
        name: "tweakapi.sayande.com",
        dns: false,
        cert: "arn:aws:acm:us-east-1:113025669772:certificate/42ccb709-932f-4a09-b299-63be23ed0f61",
      },
      routes: {
        "/tweak/*": fastapi.url,
        "/latex/*": server.publicIp.apply((ip) => `http://${ip}`),
      },
    });
    return {
      apiDomain: apiRouter.url, // This will be https://tweakapi.sayande.com
      latexDomain: server.publicIp.apply((ip) => `http://${ip}`),
      fastapiDomain: fastapi.url,
    };
  },
});

// return {
//   // Primary API endpoints
//   apiUrl: server.publicIp.apply((ip) => `http://${ip}:8000`),
//   apiDocs: server.publicIp.apply((ip) => `http://${ip}:8000/docs`),
//   healthCheck: server.publicIp.apply(
//     (ip) => `http://${ip}:8000/latex/health`,
//   ),
//   compileEndpoint: server.publicIp.apply(
//     (ip) => `http://${ip}:8000/latex/compile`,
//   ),
//   // Status and management
//   statusPage: server.publicIp.apply((ip) => `http://${ip}`),
//   serverIp: server.publicIp,
//   // Connection info
//   sshCommand: server.publicIp.apply(
//     (ip) => `ssh -i your-key.pem ubuntu@${ip}`,
//   ),
//   // Quick tests
//   quickTest: server.publicIp.apply(
//     (ip) => `curl http://${ip}:8000/latex/health`,
//   ),
//   diskCheck: server.publicIp.apply(
//     (ip) => `ssh -i your-key.pem ubuntu@${ip} "df -h"`,
//   ),
//   // Configuration summary
//   config: {
//     python: "3.10 (Ubuntu default)",
//     storage: "20GB EBS gp3",
//     latex: "Minimal installation (~1.2GB)",
//     packages: "pip (standard)",
//     estimatedFreeSpace: "~15GB",
//   },
// };
