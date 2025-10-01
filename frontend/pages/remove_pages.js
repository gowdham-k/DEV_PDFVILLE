import { useState } from "react";
import UpgradeModal from "../components/UpgradeModal";
import { API_BASE_URL } from "../components/config";

// --- Premium modal handling injected ---
function useUpgradeModal() {
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  return { showModal, setShowModal, modalMsg, setModalMsg };
}

export default function RemovePagesPage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [pagesToRemove, setPagesToRemove] = useState("");
  const [removalType, setRemovalType] = useState("specific");

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
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

  const validatePageRanges = (ranges) => {
    const pattern = /^(\d+(-\d+)?,?\s*)+$/;
    return pattern.test(ranges.replace(/\s/g, ''));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please select at least 1 PDF file");
      return;
    }

    if (!pagesToRemove.trim()) {
      alert("Please specify pages to remove");
      return;
    }

    if (!validatePageRanges(pagesToRemove)) {
      alert("Invalid page range format. Use format like: 1,3,5-7,10");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });
      
      formData.append("pages_to_remove", pagesToRemove);
      formData.append("removal_type", removalType);

      const response = await fetch(`${API_BASE_URL}/api/pdf-remove-pages`, {
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
      a.download = files.length === 1 ? `pages_removed_${files[0].name}` : "pages_removed_pdfs.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      alert("Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    window.location.href = "/";
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
    pageSettings: {
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
      background: files.length > 0 && pagesToRemove.trim() ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: files.length > 0 && pagesToRemove.trim() ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
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
          ← Back to Home
        </button>

        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span>🗑️</span>
          </div>
          <h1 style={styles.title}>Remove Pages</h1>
          <p style={styles.subtitle}>Delete specific pages from your PDF documents</p>
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.instructions}>
              <h3 style={styles.instructionTitle}>🗑️ How to Remove Pages:</h3>
              <ul style={styles.instructionList}>
                <li>Select or drop PDF files to remove pages from</li>
                <li>Specify which pages to remove using page numbers and ranges</li>
                <li>Use commas to separate multiple pages: 1,3,5</li>
                <li>Use hyphens for ranges: 5-10 (removes pages 5 through 10)</li>
                <li>Click "Remove Pages" to process your files</li>
              </ul>
            </div>

            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>📁</span>
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
                {files.length > 0 ? '📄' : '📁'}
              </div>
              
              <p style={styles.uploadText}>
                {files.length > 0 ? `${files.length} files selected` : 'Drop PDF files here or click to browse'}
              </p>
              <p style={styles.uploadSubtext}>
                Select PDF files to remove pages from
              </p>
            </div>

            {files.length > 0 && (
              <div style={styles.filesList}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <button onClick={removeAllFiles} style={styles.removeAllButton}>
                    🗑️ Remove All Files
                  </button>
                </div>
                
                {files.map((file, index) => (
                  <div key={file.name + index} className="file-item" style={styles.fileItem}>
                    <span style={styles.fileIcon}>📄</span>
                    <span style={styles.fileName}>
                      {index + 1}. {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      style={styles.removeButton}
                      title="Remove file"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>🗑️</span>
              Page Removal Settings
            </h2>

            <div style={styles.pageSettings}>
              <label style={styles.settingLabel}>Pages to Remove</label>
              <input
                type="text"
                value={pagesToRemove}
                onChange={(e) => setPagesToRemove(e.target.value)}
                placeholder="e.g., 1,3,5-7,10"
                style={styles.input}
              />
              <div style={styles.exampleText}>
                Examples:
                <br />
                • Single pages: 1,3,5
                <br />
                • Page ranges: 2-5 (removes pages 2, 3, 4, 5)
                <br />
                • Mixed: 1,3,5-7,10 (removes pages 1, 3, 5, 6, 7, 10)
              </div>
            </div>
          </div>

          <div style={styles.actionSection}>
            <button
              onClick={handleSubmit}
              disabled={files.length === 0 || !pagesToRemove.trim() || isProcessing}
              style={styles.processButton}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" style={styles.spinner}></div>
                  Removing Pages...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>🗑️</span>
                  Remove Pages from {files.length} PDF{files.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
            
            {(files.length === 0 || !pagesToRemove.trim()) && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                {files.length === 0 ? 'Please select PDF files' : 'Please specify pages to remove'}
              </p>
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