import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '../components/config';
import { CategoryContext } from '../components/layout';

export default function PdfToPdfA() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const router = useRouter();
  const { isAuthenticated, user } = useContext(CategoryContext);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Please select a valid PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/convert-pdf-to-pdfa`);

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.onload = function() {
        setIsUploading(false);
        if (xhr.status === 200) {
          // Create a blob from the response
          const blob = new Blob([xhr.response], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          setDownloadUrl(url);
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            setError(errorResponse.error || 'Conversion failed');
          } catch (e) {
            setError('Conversion failed');
          }
        }
      };

      xhr.onerror = function() {
        setIsUploading(false);
        setError('Network error occurred');
      };

      xhr.responseType = 'blob';
      xhr.send(formData);
    } catch (err) {
      setIsUploading(false);
      setError('Error uploading file: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Convert PDF to PDF/A</h1>
      <p style={{ marginBottom: '2rem', textAlign: 'center', color: '#666' }}>
        Convert your PDF documents to PDF/A format for long-term archiving and preservation.
        PDF/A is an ISO-standardized version of PDF designed for long-term document preservation.
      </p>

      <div style={{ 
        background: '#fff', 
        borderRadius: '12px', 
        padding: '2rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="file-upload" 
              style={{
                display: 'block',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#f9f9f9',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {file ? file.name : 'Choose a PDF file or drag & drop it here'}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF files only'}
              </div>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {error && (
            <div style={{ 
              color: '#d32f2f', 
              backgroundColor: '#ffebee', 
              padding: '0.75rem', 
              borderRadius: '4px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {isUploading && (
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                Uploading: {uploadProgress}%
              </div>
              <div style={{ 
                height: '8px', 
                backgroundColor: '#e0e0e0', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${uploadProgress}%`, 
                  backgroundColor: '#4caf50',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          )}

          {downloadUrl && (
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#e8f5e9', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '1rem', fontWeight: 'bold', color: '#2e7d32' }}>
                Conversion successful!
              </p>
              <a 
                href={downloadUrl} 
                download={`pdfa_${file ? file.name : 'document.pdf'}`}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease'
                }}
              >
                Download PDF/A
              </a>
            </div>
          )}

          <button 
            type="submit" 
            disabled={!file || isUploading}
            style={{
              display: 'block',
              width: '100%',
              padding: '1rem',
              backgroundColor: !file || isUploading ? '#ccc' : '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: !file || isUploading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s ease'
            }}
          >
            {isUploading ? 'Converting...' : 'Convert to PDF/A'}
          </button>
        </form>
      </div>

      <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ marginBottom: '1rem' }}>About PDF/A Format</h3>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          PDF/A is a specialized version of the PDF format designed for the long-term archiving of electronic documents. 
          It ensures that documents will render exactly the same way regardless of what software is used to view them in the future.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Key features of PDF/A include:
        </p>
        <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.6' }}>
          <li>All fonts are embedded within the document</li>
          <li>Color spaces are specified in a device-independent manner</li>
          <li>No audio, video, or executable content is allowed</li>
          <li>No encryption is permitted</li>
          <li>Metadata is stored in a standardized format</li>
        </ul>
      </div>
    </div>
  );
}