import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UpgradeModal from "../components/UpgradeModal";
import { API_BASE_URL } from "../components/config";

// --- Premium modal handling injected ---
function useUpgradeModal() {
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  return { showModal, setShowModal, modalMsg, setModalMsg };
}

export default function AddPageNumbersPage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [position, setPosition] = useState("bottom-center");
  const [startNumber, setStartNumber] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [color, setColor] = useState("#000000");
  const [errorMessage, setErrorMessage] = useState("");

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
      setFiles(prev => [...prev, ...selectedFiles]);
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
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setFiles([]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please select at least 1 PDF file to add page numbers");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });
      
      // Add page numbering settings
      formData.append("position", position);
      formData.append("start_number", startNumber.toString());
      formData.append("font_size", fontSize.toString());
      formData.append("color", color);

      console.log("Sending page numbering request to:", `${API_BASE_URL}/pdf-add-page-numbers`);
      console.log("No authentication required for page numbering feature");
      
      const response = await fetch(`${API_BASE_URL}/pdf-add-page-numbers`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      console.log("Page numbering response status:", response.status);
      console.log("Page numbering response OK:", response.ok);

      if (!response.ok) {
        console.error(`Page numbering request failed with status: ${response.status}`);
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Set filename based on response headers or default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'numbered_pdf.pdf';
      
      if (contentDisposition && contentDisposition.includes('filename=')) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        } else {
          const filenameMatch = contentDisposition.match(/filename=([^;]+)/i);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].trim();
          }
        }
      } else if (files.length === 1) {
        filename = `numbered_${files[0].name}`;
      } else {
        filename = 'numbered_pdfs.zip';
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log("\u2705 Page numbering completed successfully");
    } catch (error) {
      console.error("\u274C Error adding page numbers:", error);
      setErrorMessage("Failed to add page numbers. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    router.push('/');
  };

  const styles = {
    container: {
      fontFamily: 'Arial, sans-serif',
      color: '#333333',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    },
    maxWidth: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    backButton: {
      background: 'none',
      border: 'none',
      color: '#666666',
      fontSize: '16px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '20px',
      padding: '8px 16px',
      borderRadius: '8px',
      transition: 'background 0.2s',
      fontWeight: '600'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    headerIcon: {
      fontSize: '64px',
      marginBottom: '16px'
    },
    title: {
      fontSize: '36px',
      fontWeight: '700',
      marginBottom: '8px',
      color: '#333333'
    },
    subtitle: {
      fontSize: '18px',
      color: '#666666',
      maxWidth: '600px',
      margin: '0 auto'
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
      fontSize: '24px',
      marginRight: '16px'
    },
    fileName: {
      flex: 1,
      fontSize: '16px',
      fontWeight: '500',
      color: '#333333',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#666666',
      fontSize: '24px',
      cursor: 'pointer',
      padding: '0 8px',
      transition: 'all 0.2s ease'
    },
    pageNumberSettings: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    settingGroup: {
      marginBottom: '16px'
    },
    settingLabel: {
      display: 'block',
      fontSize: '16px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#333333'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #f0f0f0',
      borderRadius: '8px',
      transition: 'border 0.2s ease'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '2px solid #f0f0f0',
      borderRadius: '8px',
      background: 'white',
      cursor: 'pointer'
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    rangeInput: {
      flex: 1,
      height: '8px',
      appearance: 'none',
      borderRadius: '4px',
      background: '#f0f0f0',
      outline: 'none',
      cursor: 'pointer'
    },
    rangeValue: {
      minWidth: '50px',
      padding: '8px 12px',
      background: '#666666',
      color: 'white',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '600',
      textAlign: 'center'
    },
    colorInput: {
      width: '100%',
      height: '50px',
      border: '2px solid #f0f0f0',
      borderRadius: '8px',
      cursor: 'pointer',
      background: 'none'
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
      background: files.length > 0 ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: files.length > 0 ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
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
      background: '#f8f8f8',
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
    error: {
      color: '#e74c3c',
      padding: '12px',
      borderRadius: '8px',
      background: '#fdecea',
      marginTop: '16px',
      fontSize: '14px',
      fontWeight: '500',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        body {
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .spinner { animation: spin 1s linear infinite; }
        button:hover:not(:disabled) { transform: translateY(-2px); }
        .file-item:hover { border-color: #666666; box-shadow: 0 4px 12px rgba(102, 102, 102, 0.2); }
      `}</style>

      <div style={styles.maxWidth}>
        <button onClick={goBack} style={styles.backButton}>
          ← Back to Home
        </button>

        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span>\uD83D\uDD22</span>
          </div>
          <h1 style={styles.title}>Add Page Numbers</h1>
          <p style={styles.subtitle}>Add page numbers to your PDF documents</p>
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.instructions}>
              <h3 style={styles.instructionTitle}>\uD83D\uDD22 How to Add Page Numbers:</h3>
              <ul style={styles.instructionList}>
                <li>Select or drop PDF files to add page numbers to</li>
                <li>Customize the position, starting number, font size, and color</li>
                <li>Click "Add Page Numbers" to process your files</li>
                <li>Download the numbered PDFs automatically</li>
              </ul>
            </div>

            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>\uD83D\uDCC1</span>
              Select PDF Files
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
                multiple
                accept=".pdf"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
              
              <div style={styles.uploadIcon}>
                {files.length > 0 ? '\uD83D\uDCC4' : '\uD83D\uDCC1'}
              </div>
              
              <p style={styles.uploadText}>
                {files.length > 0 ? `${files.length} files selected` : 'Drop PDF files here or click to browse'}
              </p>
              <p style={styles.uploadSubtext}>
                Select PDF files to add page numbers
              </p>
            </div>

            {files.length > 0 && (
              <div style={styles.filesList}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <button onClick={removeAllFiles} style={styles.removeAllButton}>
                    \uD83D\uDDD1\uFE0F Remove All Files
                  </button>
                </div>
                
                {files.map((file, index) => (
                  <div key={file.name + index} className="file-item" style={styles.fileItem}>
                    <span style={styles.fileIcon}>\uD83D\uDCC4</span>
                    <span style={styles.fileName}>
                      {index + 1}. {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      style={styles.removeButton}
                      title="Remove file"
                    >
                      \u00D7
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>\uD83D\uDD22</span>
              Page Number Settings
            </h2>

            <div style={styles.pageNumberSettings}>
              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  style={styles.select}
                >
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                </select>
              </div>

              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>Start Number</label>
                <input
                  type="number"
                  min="1"
                  value={startNumber}
                  onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                  style={styles.input}
                />
              </div>

              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>Font Size: {fontSize}px</label>
                <div style={styles.rangeContainer}>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    style={styles.rangeInput}
                  />
                  <div style={styles.rangeValue}>{fontSize}px</div>
                </div>
              </div>

              <div style={styles.settingGroup}>
                <label style={styles.settingLabel}>Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={styles.colorInput}
                />
              </div>
            </div>
          </div>

          <div style={styles.actionSection}>
            <button
              onClick={handleSubmit}
              disabled={files.length === 0 || isProcessing}
              style={styles.processButton}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" style={styles.spinner}></div>
                  Adding Page Numbers...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>\uD83D\uDD22</span>
                  Add Page Numbers to {files.length} PDF{files.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
            
            {files.length === 0 && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                Please select PDF files
              </p>
            )}

            {errorMessage && (
              <div style={styles.error}>
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// /* UPGRADE MODAL RENDER */
export function UpgradeModalRenderer({ show, msg, onClose }) {
  if (!show) return null;
  return <UpgradeModal message={msg} onClose={onClose} />;
}