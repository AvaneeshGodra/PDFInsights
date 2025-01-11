# Use a lightweight Python image with Debian-based Linux
FROM python:3.10-slim

# Install system dependencies, including Tesseract OCR
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    && apt-get clean

# Set the working directory in the container
WORKDIR /app

# Copy the backend files into the container
COPY . /app

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the application port
EXPOSE 8000

# Start the backend service
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
