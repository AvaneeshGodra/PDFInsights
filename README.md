<div align="center">

# 🔍 PDFinsites

A powerful web-based platform for intelligent PDF analysis and querying using AI

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/s3/)
[![Groq](https://img.shields.io/badge/Groq-000000?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)

</div>

## 📋 Overview

PDFinsites revolutionizes document analysis by combining powerful PDF processing with state-of-the-art AI technology. Upload your PDFs and interact with their content through natural language queries, powered by Groq's advanced language models.

## ✨ Key Features

- 📤 **Seamless PDF Upload**: Direct storage to AWS S3 with automatic processing
- 📝 **Intelligent Text Extraction**: Advanced parsing using Fitz (PyMuPDF)
- 🤖 **AI-Powered Querying**: Context-aware answers using Groq's LLM API
- 📊 **Smart Summarization**: Generate summaries of varying lengths with just a click
- 🔐 **Multi-Tenant Architecture**: Secure, isolated storage and querying per user
- 🔍 **OCR Capability**: Extract text from scanned documents (AWS deployment only)

## 🛠️ Technology Stack

### Backend Infrastructure
- 🚀 **FastAPI**: High-performance web framework
- 🐘 **PostgreSQL**: Robust data storage with SQLAlchemy ORM
- ☁️ **AWS S3**: Scalable file storage solution
- 🧠 **Groq API**: Advanced LLM integration (Llama3-70b-8192 model)

### Processing Engines
- 📄 **Fitz (PyMuPDF)**: PDF parsing
- 👁️ **Tesseract**: OCR processing via pdf2image and pytesseract

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js
- AWS Account
- Groq API Access

### Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/pdfinsites.git
cd pdfinsites
```

2. **Install Dependencies**
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

3. **Configure Environment Variables**

#### Backend Configuration
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket
GROQ_API_KEY=your_groq_key
DATABASE_URL=your_db_url
```

#### Frontend Configuration
```env
REACT_APP_AWS_ACCESS_KEY_ID=your_key
REACT_APP_AWS_SECRET_ACCESS_KEY=your_secret
REACT_APP_AWS_REGION=your_region
REACT_APP_AWS_BUCKET_NAME=your_bucket
REACT_APP_CHATBOX=endpoint_url
REACT_APP_UPLOAD=upload_url
```

## 🔄 System Flow

### PDF Processing Flow
```mermaid
graph LR
    A[User Upload] --> B[Frontend]
    B --> C[AWS S3]
    C --> D[Backend Processing]
    D --> E[Database Storage]
```

### Query Flow
```mermaid
graph LR
    A[User Query] --> B[Frontend]
    B --> C[Backend]
    C --> D[Text Retrieval]
    D --> E[Groq Processing]
    E --> F[Response Display]
```

## 🔌 API Endpoints

### Upload PDF
```http
POST /upload_pdf
Content-Type: application/json

{
    "user_id": "string",
    "filename": "string"
}
```

### Query PDF
```http
POST /query_pdf
Content-Type: application/json

{
    "user_id": "string",
    "question": "string"
}
```

## 🔒 Security Considerations

- 🔐 **Environment Variables**: Secure storage of sensitive credentials
- 🌐 **CORS Protection**: Configured access control for production
- 📂 **S3 Security**: Implement strict IAM policies
- 🔑 **API Authentication**: Secured endpoint access

## 💡 OCR Implementation

To enable OCR capabilities (AWS deployment only), update the text extraction code:

```python
# Current Implementation
with fitz.open(stream=file_content, filetype="pdf") as doc:
    for page in doc:
        text += page.get_text()

# OCR Implementation
images = convert_from_bytes(file_content)
for image in images:
    text += image_to_string(image, lang="eng")
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Made with ❤️ by the PDFinsites Team
</div>
