# The python version to use is supplied as an arg from SST
ARG PYTHON_VERSION=3.10

# Use Ubuntu base image (same as your working EC2) instead of Lambda base
FROM ubuntu:22.04

# Set timezone non-interactively to avoid prompts
ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=UTC

# Install Python and Lambda runtime dependencies
RUN apt-get update -y && \
    apt-get install -y \
        python3 \
        python3-pip \
        git \
        gcc \
        wget \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install your EXACT working EC2 LaTeX packages
RUN apt-get update -y && \
    apt-get install -y \
        texlive-latex-base \
        texlive-xetex \
        texlive-fonts-recommended \
        texlive-latex-extra && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install AWS Lambda Runtime Interface Client
RUN pip3 install awslambdaric

# Set up Lambda environment
ENV LAMBDA_TASK_ROOT=/var/task
ENV LAMBDA_RUNTIME_DIR=/var/runtime
RUN mkdir -p ${LAMBDA_TASK_ROOT} ${LAMBDA_RUNTIME_DIR}

# Install UV to manage your python runtime
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Install the dependencies to the lambda runtime
COPY requirements.txt ${LAMBDA_TASK_ROOT}/requirements.txt
WORKDIR ${LAMBDA_TASK_ROOT}
RUN uv pip install -r requirements.txt --system

# Copy the rest of the code
COPY . ${LAMBDA_TASK_ROOT}

# Set up Lambda entry point
ENTRYPOINT ["/usr/bin/python3", "-m", "awslambdaric"]