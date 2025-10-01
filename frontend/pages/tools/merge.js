

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../../components/config";
import HubspotTracking, { trackEvent } from "../../components/HubspotTracking";
import Head from "next/head";

export default function MergePage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  
  // Function to close the upgrade modal
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

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

  const handleFileDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleFileDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
  };

  const handleFileDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newFiles = [...files];
      const draggedFile = newFiles[draggedIndex];
      
      newFiles.splice(draggedIndex, 1);
      newFiles.splice(dropIndex, 0, draggedFile);
      
      setFiles(newFiles);
    }
    setDraggedIndex(null);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeAllFiles = () => {
    setFiles([]);
  };

  const handleSubmit = async () => {
    if (files.length < 2) {
      alert("Please select at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });

      const response = await fetch(`${API_BASE_URL}/api/merge`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 403) {
        const errorData = await response.json();
        if (errorData.show_upgrade) {
          setUpgradeMessage(errorData.error);
          setShowUpgradeModal(true);
        } else {
          alert("Error: " + errorData.error);
        }
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
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
      cursor: 'move',
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
      background: files.length >= 2 ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: files.length >= 2 ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
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
    <>
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
            <span>📄</span>
          </div>
          <h1 style={styles.title}>Merge PDFs</h1>
          <p style={styles.subtitle}>Combine multiple PDF files into one document</p>
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.instructions}>
              <h3 style={styles.instructionTitle}>📋 How to Merge PDFs:</h3>
              <ul style={styles.instructionList}>
                <li>Select or drop multiple PDF files (minimum 2 files required)</li>
                <li><strong>Free users:</strong> Limited to merging 2 PDF files at a time</li>
                <li>Drag and drop files to reorder them in your preferred sequence</li>
                <li>Click "Merge PDFs" to combine them into a single document</li>
                <li>The merged PDF will be downloaded automatically</li>
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
                Select 2 or more PDF files to merge
              </p>
            </div>

            {files.length > 0 && (
              <div style={styles.filesList}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <button onClick={removeAllFiles} style={styles.removeAllButton}>
                    🗑️ Remove All Files
                  </button>
                </div>
                
                <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', marginBottom: '16px' }}>
                  📋 Drag files to reorder • Files will be merged in this order
                </p>
                
                {files.map((file, index) => (
                  <div
                    key={file.name + index}
                    className="file-item"
                    draggable
                    onDragStart={(e) => handleFileDragStart(e, index)}
                    onDragOver={handleFileDragOver}
                    onDrop={(e) => handleFileDrop(e, index)}
                    style={styles.fileItem}
                  >
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

          <div style={styles.actionSection}>
            <button
              onClick={handleSubmit}
              disabled={files.length < 2 || isProcessing}
              style={styles.processButton}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" style={styles.spinner}></div>
                  Merging PDFs...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>📄</span>
                  Merge {files.length} PDFs
                </>
              )}
            </button>
            
            {files.length < 2 && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                Please select at least 2 PDF files to merge
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    
    {/* Upgrade Modal - Implemented directly for better control */}
    {showUpgradeModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div className="bg-white p-6 rounded-xl shadow-xl text-center max-w-sm" style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', maxWidth: '400px', position: 'relative', zIndex: 10000, margin: 'auto'}}>
          <h2 className="text-xl font-bold mb-3" style={{fontSize: '20px', fontWeight: 'bold', marginBottom: '12px'}}>Upgrade Required</h2>
          <p className="mb-4" style={{marginBottom: '16px'}}>{upgradeMessage}</p>
          <div className="flex justify-center gap-4" style={{display: 'flex', justifyContent: 'center', gap: '16px'}}>
            <button
              onClick={() => window.location.href = "/pricing"}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              style={{backgroundColor: '#3B82F6', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer'}}
            >
              Upgrade Now
            </button>
            <button
              onClick={closeUpgradeModal}
              className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              style={{backgroundColor: '#D1D5DB', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer'}}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
