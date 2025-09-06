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
          description: "HTTP for ALB",
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

    // Your original user data script with proper FastAPI setup
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
cd /app/tweak.jobs/apps/ai/latex/src/latex
source /app/tweak.jobs/apps/ai/latex/.venv/bin/activate
python3 -m uvicorn api:app --host 0.0.0.0 --port 8000
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
    const server = new aws.ec2.Instance("latex-api-simple", {
      instanceType: "t3.medium",
      ami: ami.then((ami) => ami.id),
      userData: userData,
      vpcSecurityGroupIds: [securityGroup.id],
      associatePublicIpAddress: true,
      rootBlockDevice: {
        volumeSize: 20,
        volumeType: "gp3",
        deleteOnTermination: true,
      },
      tags: {
        Name: "LaTeX-API-Simple",
        Python: "3.10-Ubuntu-Default",
        Storage: "20GB-EBS",
        LaTeX: "Minimal",
      },
    });

    // Get default VPC and subnets for ALB
    const defaultVpc = aws.ec2.getVpc({ default: true });
    const defaultSubnets = aws.ec2.getSubnets({
      filters: [{ name: "default-for-az", values: ["true"] }],
    });

    // Application Load Balancer
    const alb = new aws.lb.LoadBalancer("latex-alb", {
      loadBalancerType: "application",
      securityGroups: [securityGroup.id],
      subnets: defaultSubnets.then((subnets) => subnets.ids),
      enableDeletionProtection: false,
    });

    // Target Group for EC2 instance
    const targetGroup = new aws.lb.TargetGroup("latex-tg", {
      port: 8000,
      protocol: "HTTP",
      vpcId: defaultVpc.then((vpc) => vpc.id),
      healthCheck: {
        enabled: true,
        path: "/",
        protocol: "HTTP",
        port: "8000",
      },
    });

    // ALB Listener
    const listener = new aws.lb.Listener("latex-listener", {
      loadBalancerArn: alb.arn,
      port: 80,
      protocol: "HTTP",
      defaultActions: [
        {
          type: "forward",
          targetGroupArn: targetGroup.arn,
        },
      ],
    });

    // Attach EC2 to Target Group
    const attachment = new aws.lb.TargetGroupAttachment("latex-attachment", {
      targetGroupArn: targetGroup.arn,
      targetId: server.id,
      port: 8000,
    });

    // Lambda FastAPI function
    const fastapi = new sst.aws.Function("FastAPI", {
      handler: "tweak/src/tweak/api.handler",
      runtime: "python3.10",
      url: true,
    });

    // Router with ALB DNS (CloudFront compatible)
    const apiRouter = new sst.aws.Router("LaTeXAPIRouter", {
      domain: {
        name: "tweakapi.sayande.com",
        dns: false,
        cert: "arn:aws:acm:us-east-1:113025669772:certificate/c3f98b37-042b-4788-8e3f-5fabfe790997",
      },
      routes: {
        "/tweak/*": fastapi.url,
        "/latex/*": alb.dnsName.apply((dns) => `http://${dns}`),
      },
    });

    return {
      apiDomain: apiRouter.url, // This will be https://tweakapi.sayande.com
      latexDomain: alb.dnsName.apply((dns) => `http://${dns}`),
      fastapiDomain: fastapi.url,
      directLatexUrl: server.publicIp.apply((ip) => `http://${ip}:8000`),
    };
  },
});
