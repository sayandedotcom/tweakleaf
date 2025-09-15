ARG PYTHON_VERSION=3.11

FROM public.ecr.aws/lambda/python:${PYTHON_VERSION}

# Copy requirements and install
COPY requirements.txt ${LAMBDA_TASK_ROOT}/
RUN pip install -r requirements.txt

# Copy app code
COPY . ${LAMBDA_TASK_ROOT}

WORKDIR ${LAMBDA_TASK_ROOT}