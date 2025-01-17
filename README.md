# **PDFinsites**

PDFinsites is a web-based platform that allows users to upload PDF documents, extract text and query the extracted content using an AI-powered language model (Groq). The system is built with FastAPI, PostgreSQL, AWS S3, and integrates the Groq API to provide intelligent, context-aware responses to user queries.

## **Table of Contents**

- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [Update Code For OCR](#Code-Update-For-OCR)
- [API Endpoints](#api-endpoints)
  - [Upload PDF](#upload-pdf)
  - [Query PDF](#query-pdf)
- [Frontend Summary Buttons](#Frontend-Summary-Buttons)
- [Security](#security)

## **Overview**

PDFinsites helps users extract text from PDFs and query the content using an AI model to retrieve contextually accurate answers. The platform is intended to assist with documents that need to be parsed and understood, such as contracts, technical manuals, and reports. It uses **Groq's LLM API** for answering questions based on extracted document text and **AWS S3** for file storage.

## **Features**

- **Upload PDFs**: Users can upload PDF files to the platform, which are stored in **AWS S3**.
- **Text Extraction**: Text is extracted from PDF files using the Fitz (PyMuPDF) library for direct PDF parsing.
- **Question-Answering**: Users can query the extracted text using **Groq's LLM API** to receive context-aware answers.
- **Summarization**: The platform provides buttons for generating short, medium, and long summaries of the extracted text. Users can click each 
  button twice to generate the corresponding summary length.
- **PDF Metadata Storage**: Metadata and extracted text are stored in a **PostgreSQL** database.
- **Multi-Tenant Support**: Users can store and query their PDFs independently using unique user IDs.

## **Technologies**

- **Backend**: FastAPI
- **Database**: PostgreSQL (SQLAlchemy ORM)
- **File Storage**: AWS S3
- **Text Extraction**: Fitz (PyMuPDF)
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
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - AWS_REGION
  - AWS_BUCKET_NAME
  - GROQ_API_KEY
  - DATABASE_URL
  
 - **Frontend**: 
  - REACT_APP_AWS_ACCESS_KEY_ID
  - REACT_APP_AWS_SECRET_ACCESS_KEY
  - REACT_APP_AWS_REGION
  - REACT_APP_AWS_BUCKET_NAME
  - REACT_APP_CHATBOX
  - REACT_APP_UPLOAD


### Code Update For OCR
As part of the feature development, the following code was initially used for text extraction:
- Read PDF content using Fitz (PyMuPDF)
- text = ""
- with fitz.open(stream=file_content, filetype="pdf") as doc:
   -  for page in doc:
       -  text += page.get_text()

- if not text.strip():
   - raise HTTPException(status_code=500, detail="Failed to extract text from PDF")

- For OCR not in the code because OCR works on System Level and Render (Free tier) does not allows System Level access can be done if deployed on AWS.
- Just need to change the above part of the code to this one and istall the dependencies.

 -  Convert PDF pages to images using pdf2image
- images = convert_from_bytes(file_content)

-  Extract text using OCR (Tesseract)
- text = ""
- for image in images:
   -  text += image_to_string(image, lang="eng")

- if not text.strip():
   -  raise HTTPException(status_code=500, detail="Failed to extract text using OCR")


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

### Frontend Summary Buttons
In addition to PDF upload and querying, the platform includes buttons for summarization. Users can click on the following buttons to generate a summary of different lengths based on the extracted text:

- Short Summary: Generates a concise summary of the document.
- Medium Summary: Provides a more detailed summary.
- Long Summary: Delivers a comprehensive summary.
- Each button is clickable twice to trigger the summarization process, allowing users to receive the desired length of the summary.

### Security
Environment Variables: Sensitive keys (e.g., AWS, Groq) are stored in .env files and should not be exposed publicly.
CORS: CORS middleware is configured to allow access from specific frontend URLs in production. By default, it allows all origins ("*").
AWS S3: Ensure that your AWS S3 bucket has proper IAM policies restricting access to only the required actions (e.g., upload, download).






