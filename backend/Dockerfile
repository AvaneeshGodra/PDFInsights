# Use an official Python runtime as a base image
FROM python:3.9-slim

# Install Tesseract OCR and other necessary packages
RUN apt-get update && apt-get install -y tesseract-ocr

# Verify Tesseract installation (print the version)
RUN tesseract --version

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port your app will be running on (Render uses dynamic ports)
EXPOSE 8000

# Run the application using uvicorn (ensure it's listening on 0.0.0.0 and using the dynamic port)
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
