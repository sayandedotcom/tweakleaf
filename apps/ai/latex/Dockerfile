ARG PYTHON_VERSION=3.11
FROM public.ecr.aws/lambda/python:${PYTHON_VERSION}

# Install system dependencies including Perl modules needed for TeX Live
RUN yum update -y && \
    yum install -y \
    wget \
    tar \
    perl \
    perl-Digest-MD5 \
    fontconfig \
    freetype \
    git \
    gcc \
    make \
    && yum clean all

# Install TeX Live directly
RUN wget http://mirror.ctan.org/systems/texlive/tlnet/install-tl-unx.tar.gz && \
    tar -xzf install-tl-unx.tar.gz && \
    cd install-tl-* && \
    echo "selected_scheme scheme-basic" > profile && \
    echo "option_doc 0" >> profile && \
    echo "option_src 0" >> profile && \
    ./install-tl -profile profile && \
    cd .. && \
    rm -rf install-tl-* install-tl-unx.tar.gz

# Add TeX Live to PATH
ENV PATH="/usr/local/texlive/2024/bin/x86_64-linux:${PATH}"

# Install additional TeX packages
RUN tlmgr install \
    xetex \
    latexmk \
    graphics \
    tools \
    amsmath \
    amsfonts

# Install UV
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy fonts
COPY latex/OpenFonts/ /usr/local/share/fonts/
RUN fc-cache -fv

# Install Python dependencies
RUN uv pip install pdflatex>=0.1.3 --system

# Copy source code
COPY latex/ ${LAMBDA_TASK_ROOT}/src/latex

WORKDIR ${LAMBDA_TASK_ROOT}

# Verify installation
RUN which pdflatex && pdflatex --version
RUN which xelatex && xelatex --version