import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../components/config";

export default function SignPDFPage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [signatureText, setSignatureText] = useState("");
  const [positionX, setPositionX] = useState(100);
  const [positionY, setPositionY] = useState(100);
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Clear error message after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      getPageCount(selectedFiles[0]);
    }
  };

  const getPageCount = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setTotalPages(pdf.numPages);
      setPageNumber(0); // Reset to first page
    } catch (error) {
      console.error("Error getting page count:", error);
      setTotalPages(1);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
      getPageCount(droppedFiles[0]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    if (files.length <= 1) {
      setTotalPages(1);
      setPageNumber(0);
    }
  };

  const removeAllFiles = () => {
    setFiles([]);
    setTotalPages(1);
    setPageNumber(0);
  };

  const handleSubmit = async () => {
    if (!files.length) {
      setErrorMessage("Please select a PDF file to sign");
      return;
    }

    if (!signatureText) {
      setErrorMessage("Please enter signature text");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("signature_text", signatureText);
      formData.append("position_x", positionX);
      formData.append("position_y", positionY);
      formData.append("page_number", pageNumber);
      
      const response = await fetch(`${API_BASE_URL}/api/pdf-sign`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `signed_${files[0].name}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        setErrorMessage("Connection error: Unable to reach the server. Please check your internet connection and try again.");
      } else {
        setErrorMessage("Error: " + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    router.push("/");
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
      padding: '0px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    maxWidth: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px'
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '12px 20px',
      background: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid #666666',
      borderRadius: '12px',
      color: '#666666',
      textDecoration: 'none',
      fontWeight: '600',
      marginBottom: '24px',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    headerIcon: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '80px',
      height: '80px',
      background: '#666666',
      borderRadius: '20px',
      marginBottom: '16px',
      boxShadow: '0 10px 30px rgba(102, 102, 102, 0.3)',
      fontSize: '32px',
      color: '#ffffff'
    },
    title: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#333333',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: '#666666',
      fontSize: '18px',
      margin: 0
    },
    card: {
      background: 'white',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(102, 102, 102, 0.15)',
      overflow: 'hidden',
      border: '1px solid rgba(102, 102, 102, 0.1)'
    },
    section: {
      padding: '32px',
      borderBottom: '1px solid #f5f5f5'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center'
    },
    dropZone: {
      position: 'relative',
      border: '3px dashed #666666',
      borderRadius: '16px',
      padding: '48px 32px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      background: dragActive ? '#f5f5f5' : '#f8f9ff'
    },
    fileInput: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0,
      cursor: 'pointer'
    },
    uploadIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      fontSize: '40px',
      background: files.length > 0 ? '#f5f5f5' : '#f0f0f0'
    },
    uploadText: {
      fontSize: '24px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#333333'
    },
    uploadSubtext: {
      fontSize: '16px',
      color: '#666'
    },
    filesList: {
      marginTop: '24px'
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px',
      margin: '12px 0',
      background: '#f8f9ff',
      border: '2px solid #f5f5f5',
      borderRadius: '12px',
      transition: 'all 0.2s ease'
    },
    fileIcon: {
      marginRight: '16px',
      fontSize: '24px'
    },
    fileName: {
      flex: 1,
      fontSize: '16px',
      color: '#333333',
      fontWeight: '500'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '4px',
      color: '#666666',
      borderRadius: '4px'
    },
    signatureSettings: {
      background: '#f8f9ff',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #f0f0f0',
      marginTop: '24px'
    },
    settingLabel: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '2px solid #f0f0f0',
      borderRadius: '8px',
      fontSize: '16px',
      color: '#333333',
      background: 'white',
      transition: 'border-color 0.2s ease',
      marginBottom: '16px'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: '16px',
      marginBottom: '16px'
    },
    exampleText: {
      fontSize: '14px',
      color: '#666666',
      fontStyle: 'italic',
      marginTop: '8px'
    },
    actionSection: {
      padding: '32px',
      textAlign: 'center'
    },
    removeAllButton: {
      background: '#666666',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '12px 24px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '24px',
      transition: 'all 0.2s ease'
    },
    processButton: {
      width: '100%',
      maxWidth: '400px',
      padding: '20px 32px',
      borderRadius: '16px',
      border: 'none',
      fontSize: '20px',
      fontWeight: '700',
      color: 'white',
      cursor: 'pointer',
      background: files.length > 0 && signatureText.trim() ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: files.length > 0 && signatureText.trim() ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    spinner: {
      width: '24px',
      height: '24px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTop: '3px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '12px'
    },
    instructions: {
      background: '#f5f5f5',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px',
      border: '1px solid #666666'
    },
    instructionTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '12px'
    },
    instructionList: {
      color: '#666666',
      fontSize: '14px',
      lineHeight: '1.6'
    },
    errorMessage: {
      background: '#fee',
      border: '1px solid #fcc',
      color: '#d00',
      padding: '16px',
      borderRadius: '8px',
      margin: '16px 0',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner { animation: spin 1s linear infinite; }
        button:hover:not(:disabled) { transform: translateY(-2px); }
        .file-item:hover { border-color: #666666; box-shadow: 0 4px 12px rgba(102, 102, 102, 0.2); }
      `}</style>

      <div style={styles.maxWidth}>
<button onClick={goBack} style={styles.backButton}>
  {'\u2190'} Back to Home
</button>
        <div style={styles.header}>
  <div style={styles.headerIcon}>
    <span>{'\u270D\uFE0F'}</span>
  </div>
  <h1 style={styles.title}>Sign PDF</h1>
  <p style={styles.subtitle}>Add your digital signature to PDF documents</p>
</div>
        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.instructions}>
  <h3 style={styles.instructionTitle}>
    {'\u270D\uFE0F'} How to Sign PDF:
  </h3>
  <ul style={styles.instructionList}>
    <li>Select or drop a PDF file to sign</li>
    <li>Enter your signature text</li>
    <li>Specify the position where you want the signature (X, Y coordinates)</li>
    <li>Choose the page number where the signature should appear</li>
    <li>Click "Sign PDF" to add your signature and download the signed document</li>
  </ul>
</div>
<h2 style={styles.sectionTitle}>
  <span style={{ fontSize: '28px', marginRight: '12px' }}>
    {'\uD83D\uDCC4'}
  </span>
  Select PDF File
</h2>            
            <div
              style={styles.dropZone}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
              
<div style={styles.uploadIcon}>
  {files.length > 0 ? '\uD83D\uDCC4' : '\uD83D\uDCC1'}
</div>              
              <p style={styles.uploadText}>
                {files.length > 0 ? `${files.length} file selected` : 'Drop PDF file here or click to browse'}
              </p>
              <p style={styles.uploadSubtext}>
                Select a PDF file to sign
              </p>
            </div>

            {files.length > 0 && (
              <div style={styles.filesList}>
<div style={{ textAlign: 'center', marginBottom: '16px' }}>
  <button onClick={removeAllFiles} style={styles.removeAllButton}>
    {'\uD83D\uDDD1\uFE0F'} Remove File
  </button>
</div>                
{files.map((file, index) => (
  <div key={file.name + index} className="file-item" style={styles.fileItem}>
    <span style={styles.fileIcon}>{'\uD83D\uDCC4'}</span>
    <span style={styles.fileName}>
      {file.name} ({totalPages} pages)
    </span>
    <button
      onClick={() => removeFile(index)}
      style={styles.removeButton}
      title="Remove file"
    >
      {'\u00D7'}
    </button>
  </div>
))}              </div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
  <span style={{ fontSize: '28px', marginRight: '12px' }}>
    {'\u270D\uFE0F'}
  </span>
  Signature Settings
</h2>

            <div style={styles.signatureSettings}>
              <label style={styles.settingLabel}>Signature Text</label>
              <input
                type="text"
                value={signatureText}
                onChange={(e) => setSignatureText(e.target.value)}
                placeholder="Enter your signature text"
                style={styles.input}
              />

              <div style={styles.gridContainer}>
                <div>
                  <label style={styles.settingLabel}>X Position</label>
                  <input
                    type="number"
                    value={positionX}
                    onChange={(e) => setPositionX(Number(e.target.value))}
                    min="0"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.settingLabel}>Y Position</label>
                  <input
                    type="number"
                    value={positionY}
                    onChange={(e) => setPositionY(Number(e.target.value))}
                    min="0"
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.settingLabel}>Page (0-{totalPages - 1})</label>
                  <input
                    type="number"
                    value={pageNumber}
                    onChange={(e) => setPageNumber(Number(e.target.value))}
                    min="0"
                    max={totalPages - 1}
                    style={styles.input}
                  />
                </div>
              </div>

<div style={styles.exampleText}>
  {'\u2022'} Position coordinates are in points from bottom-left corner
  <br />
  {'\u2022'} Page numbers start from 0 (first page = 0)
  <br />
  {'\u2022'} Higher X values move signature to the right, higher Y values move it up
</div>            </div>

            {errorMessage && (
              <div style={styles.errorMessage}>
                {errorMessage}
              </div>
            )}
          </div>

          <div style={styles.actionSection}>
            <button
  onClick={handleSubmit}
  disabled={files.length === 0 || !signatureText.trim() || isProcessing}
  style={styles.processButton}
>
  {isProcessing ? (
    <>
      <div className="spinner" style={styles.spinner}></div>
      Signing PDF...
    </>
  ) : (
    <>
      <span style={{ fontSize: '24px', marginRight: '12px' }}>
        {'\u270D\uFE0F'}
      </span>
      Sign PDF
    </>
  )}
</button>            
            {(files.length === 0 || !signatureText.trim()) && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                {files.length === 0 ? 'Please select a PDF file' : 'Please enter signature text'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}