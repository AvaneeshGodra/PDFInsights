# Use an official Python runtime as a base image
FROM python:3.9-slim

# Install dependencies including Tesseract OCR and Poppler
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    poppler-utils

# Verify Tesseract and Poppler installation (print versions)
RUN tesseract --version && pdftoppm -v

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port your app will be running on
EXPOSE 8000

# Run the application using uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
