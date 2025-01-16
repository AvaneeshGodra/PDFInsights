from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime
import boto3
from botocore.config import Config
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from pdf2image import convert_from_bytes
from langchain_groq import ChatGroq
from easyocr import Reader

# Load environment variables
load_dotenv()


app = FastAPI()

# Initialize the LLM with Groq
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise HTTPException(status_code=500, detail="Groq API key is missing.")

llm = ChatGroq(model="llama3-70b-8192", api_key=api_key)

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup for PostgreSQL
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    pool_size=5,
    max_overflow=10,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PDFMetadata(Base):
    __tablename__ = "pdf_metadata"
    id = Column(String, primary_key=True)
    user_id = Column(String, unique=True, index=True)
    filename = Column(String)
    extracted_text = Column(Text)

# Create tables
Base.metadata.create_all(bind=engine)

class PDFUploadRequest(BaseModel):
    user_id: str
    filename: str

class QuestionRequest(BaseModel):
    user_id: str
    question: str

# AWS S3 setup
s3_config = Config(
    region_name=os.getenv("AWS_REGION"),
    s3={'addressing_style': 'virtual'}
)

s3_client = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    config=s3_config
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize EasyOCR reader
reader = Reader(["en"], gpu=False)  # Set GPU to True if a GPU is available

@app.post("/upload_pdf")
async def upload_pdf(request: PDFUploadRequest, db: Session = Depends(get_db)):
    try:
        # Step 1: Fetch file from S3
        s3_key = f"{request.user_id}/{request.filename}"
        file_obj = s3_client.get_object(Bucket=os.getenv("AWS_BUCKET_NAME"), Key=s3_key)
        file_content = file_obj['Body'].read()

        # Step 2: Convert PDF pages to images
        images = convert_from_bytes(file_content)

        # Step 3: Extract text using EasyOCR
        text = ""
        for image in images:
            result = reader.readtext(image)
            for (_, extracted_text, _) in result:
                text += extracted_text + "\n"

        if not text.strip():
            raise HTTPException(status_code=500, detail="Failed to extract text using OCR")

        # Step 4: Create or update the database entry
        existing_pdf = db.query(PDFMetadata).filter(PDFMetadata.user_id == request.user_id).first()

        if existing_pdf:
            # Update existing record
            existing_pdf.filename = request.filename
            existing_pdf.extracted_text = text
        else:
            # Create new record
            new_pdf = PDFMetadata(
                id=str(datetime.utcnow().timestamp()),
                user_id=request.user_id,
                filename=request.filename,
                extracted_text=text,
            )
            db.add(new_pdf)

        # Commit changes to the database
        db.commit()

        return {"message": "PDF processed successfully"}

    except Exception as e:
        db.rollback()  # Add explicit rollback on error
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/query_pdf")
async def query_pdf(request: QuestionRequest, db: Session = Depends(get_db)):
    try:
        # Fetch document text from the database
        document = db.query(PDFMetadata).filter(PDFMetadata.user_id == request.user_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="User ID not found in the database.")
        if not document.extracted_text:
            raise HTTPException(status_code=404, detail="No extracted text found for the given user ID.")

        # Format the prompt
        prompt = (
            f"Document text: {document.extracted_text}...\n\n"
            f"User question: {request.question}\n\n"
            "Answer the user's question as accurately as possible."
        )

        # Call the Groq API
        response = llm.predict(prompt)
        if not response:
            raise HTTPException(status_code=500, detail="LLM returned an empty response.")

        return {"answer": response}

    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error querying the PDF: {str(e)}")
