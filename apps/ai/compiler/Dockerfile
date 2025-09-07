# Multi-stage build for maximum optimization
ARG PYTHON_VERSION=3.10

# Build stage
FROM ubuntu:22.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Install build dependencies and LaTeX
RUN apt-get update -y && \
    apt-get install -y \
        python3 \
        python3-pip \
        git \
        gcc \
        wget \
        curl \
        texlive-latex-base \
        texlive-xetex \
        texlive-fonts-recommended \
        texlive-latex-extra && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install UV
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Install Python dependencies
COPY requirements.txt /tmp/requirements.txt
RUN uv pip install -r /tmp/requirements.txt --system --no-cache && \
    pip3 install --no-cache-dir awslambdaric

# Runtime stage
FROM ubuntu:22.04 AS runtime

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC
ENV LAMBDA_TASK_ROOT=/var/task
ENV LAMBDA_RUNTIME_DIR=/var/runtime

# Install only runtime dependencies (minimal)
RUN apt-get update -y && \
    apt-get install -y \
        python3 \
        texlive-latex-base \
        texlive-xetex \
        texlive-fonts-recommended \
        texlive-latex-extra && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    rm -rf /tmp/* && \
    rm -rf /var/tmp/*

# Copy Python installation from builder
COPY --from=builder /usr/local/lib/python3.10 /usr/local/lib/python3.10
COPY --from=builder /usr/local/bin /usr/local/bin

# Set up Lambda environment
RUN mkdir -p ${LAMBDA_TASK_ROOT} ${LAMBDA_RUNTIME_DIR}
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy application code
COPY . ${LAMBDA_TASK_ROOT}

# Clean up Python bytecode
RUN find ${LAMBDA_TASK_ROOT} -type f -name "*.pyc" -delete && \
    find ${LAMBDA_TASK_ROOT} -type d -name "__pycache__" -delete && \
    find ${LAMBDA_TASK_ROOT} -type f -name "*.pyo" -delete

ENTRYPOINT ["/usr/bin/python3", "-m", "awslambdaric"]