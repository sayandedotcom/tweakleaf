# Start with a TeX Live container
FROM texlive/texlive:latest as latex-base

# Now build the Lambda function
FROM public.ecr.aws/lambda/python:3.11

# Copy TeX Live installation from the texlive container
COPY --from=latex-base /usr/local/texlive /usr/local/texlive
COPY --from=latex-base /usr/local/bin/pdflatex /usr/local/bin/pdflatex
COPY --from=latex-base /usr/local/bin/xelatex /usr/local/bin/xelatex

# Install minimal system dependencies
RUN yum update -y && \
    yum install -y \
        git \
        fontconfig \
        perl \
        which \
    && yum clean all

# Set up LaTeX environment
ENV PATH="/usr/local/texlive/bin/x86_64-linux:/usr/local/bin:${PATH}"
ENV TEXMFHOME=/tmp/.texlive/texmf
ENV TEXMFCONFIG=/tmp/.texlive/texmf-config
ENV TEXMFVAR=/tmp/.texlive/texmf-var

RUN mkdir -p /tmp/.texlive && \
    fc-cache -fv

# Install Python dependencies
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

RUN uv pip install --system \
    fastapi \
    "mangum>=0.17.0" \
    python-multipart \
    pylatex \
    uvicorn

# Copy application code
COPY . ${LAMBDA_TASK_ROOT}

WORKDIR ${LAMBDA_TASK_ROOT}