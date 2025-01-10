# **PDFinsites**

PDFinsites is a web-based platform that allows users to upload PDF documents, extract text using Optical Character Recognition (OCR), and query the extracted content using an AI-powered language model (Groq). The system is built with FastAPI, PostgreSQL, AWS S3, and integrates the Groq API to provide intelligent, context-aware responses to user queries.

## **Table of Contents**

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
  - [Upload PDF](#upload-pdf)
  - [Query PDF](#query-pdf)
- [Security](#security)
- [Testing](#testing)

## **Overview**

PDFinsites helps users extract text from PDFs and query the content using an AI model to retrieve contextually accurate answers. The platform is intended to assist with documents that need to be parsed and understood, such as contracts, technical manuals, and reports. It uses **Groq's LLM API** for answering questions based on extracted document text and **AWS S3** for file storage.

## **Features**

- **Upload PDFs**: Users can upload PDF files to the platform, which are stored in **AWS S3**.
- **OCR Extraction**: Text is extracted from PDF images using the **Tesseract OCR** engine.
- **Question-Answering**: Users can query the extracted text using **Groq's LLM API** to receive context-aware answers.
- **PDF Metadata Storage**: Metadata and extracted text are stored in a **PostgreSQL** database.
- **Multi-Tenant Support**: Users can store and query their PDFs independently using unique user IDs.

## **Technologies**

- **Backend**: FastAPI
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **File Storage**: AWS S3
- **OCR Engine**: Tesseract via **pdf2image** and **pytesseract**
- **AI Integration**: Groq (Llama3-70b-8192 model)
- **Cloud**: AWS (S3, EC2)
- **Environment Management**: dotenv for configuration management

## **Setup Instructions**

### 1. Clone the repository

### 2.  Install dependencies
pip install -r requirements.txt (for backend)
npm i (for frontend)

### 3. Set up environment variables
 - **Backend**:
  AWS_ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY
  AWS_REGION
  AWS_BUCKET_NAME
  GROQ_API_KEY
  DATABASE_URL
  
 - **Frontend**: 
  REACT_APP_AWS_ACCESS_KEY_ID
  REACT_APP_AWS_SECRET_ACCESS_KEY
  REACT_APP_AWS_REGION
  REACT_APP_AWS_BUCKET_NAME
  REACT_APP_CHATBOX
  REACT_APP_UPLOAD

### API Endpoints
Upload PDF
POST /upload_pdf
Description: Upload a PDF to the server, where it will be processed and stored in AWS S3. OCR is performed on the PDF to extract text.
Request Body:
json

{
  "user_id": "string",
  "filename": "string"
}
Response:
json

{
  "message": "PDF processed successfully"
}

Query PDF
POST /query_pdf
Description: Send a user query to get an answer based on the extracted text from a PDF.
Request Body:
json

{
  "user_id": "string",
  "question": "string"
}
Response:
json

{
  "answer": "string"
}

### Security
Environment Variables: Sensitive keys (e.g., AWS, Groq) are stored in .env files and should not be exposed publicly.
CORS: CORS middleware is configured to allow access from specific frontend URLs in production. By default, it allows all origins ("*").
AWS S3: Ensure that your AWS S3 bucket has proper IAM policies restricting access to only the required actions (e.g., upload, download).






