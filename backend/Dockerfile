# Start with the FastAPI base image
FROM tiangolo/uvicorn-gunicorn-fastapi:python3.8

# Install Tesseract and its dependencies
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-eng \
    poppler-utils \
    && apt-get clean

# Copy application code into the container
COPY ./app /app

# Expose the application port
EXPOSE 80
