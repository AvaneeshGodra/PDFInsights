import { useState } from 'react';
import { Upload } from 'lucide-react';
import axios from 'axios';
import AWS from 'aws-sdk';

// Configure AWS
const AWS_CONFIG = {
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
};

const BUCKET_NAME = process.env.REACT_APP_AWS_BUCKET_NAME;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export function Header({ userid }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    if (!file) return 'No file selected';
    if (file.type !== 'application/pdf') return 'Please upload a PDF file';
    if (file.size > MAX_FILE_SIZE) return 'File size must be less than 10MB';
    return null;
  };

  const handleFileChange = async (e) => {
    setError(null);
    const file = e.target.files?.[0];

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);

    try {
      const userId = userid;
      const s3 = new AWS.S3(AWS_CONFIG);

      // Upload to S3
      const params = {
        Bucket: BUCKET_NAME,
        Key: `${userId}/${file.name}`,
        Body: file,
        ContentType: 'application/pdf',
      };

      const uploadPromise = s3.upload(params).promise();
      uploadPromise.on('httpUploadProgress', (progress) => {
        // You can show progress to the user here if needed
        console.log(progress.loaded / progress.total * 100 + '%');
      });

      await uploadPromise;

      // Notify backend
      const response = await axios.post(
        process.env.REACT_APP_UPLOAD,
        {
          user_id: userId,
          filename: file.name,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data.message === 'PDF processed successfully') {
        setUploadedFile({ name: file.name });
        setError(null);
      } else {
        throw new Error('Failed to process PDF');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      setError(error.response?.data?.detail || 'Failed to upload file');
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold">PDF</span>
        <span className="text-sm text-gray-500">Insights</span>
      </div>
      <div className="flex items-center gap-4">
        {uploadedFile && (
          <div className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-50 rounded-md">
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-green-700 font-medium">
              {uploadedFile.name}
            </span>
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload"
            disabled={uploading || uploadedFile} // Disable when uploading or file is uploaded
          />
          <label
            htmlFor="pdf-upload"
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md cursor-pointer
              ${uploading ? 'bg-gray-400 cursor-not-allowed' :
                uploadedFile 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : uploadedFile ? 'Upload New PDF' : 'Upload PDF'}
          </label>
        </div>
      </div>
    </header>
  );
}
