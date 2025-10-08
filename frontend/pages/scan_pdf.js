"use client";
import { useState } from "react";
import { API_BASE_URL } from "../components/config";
import { useRouter } from "next/navigation";
import { useUpgrade } from "../context/UpgradeContext";

// Define keyframes for spinner animation
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function ScanPDFPage() {
  const router = useRouter();
  
  // State declarations
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [language, setLanguage] = useState("eng");
  const [dpi, setDpi] = useState(300);
  const [outputFormat, setOutputFormat] = useState("txt");
  
  // Use global upgrade context
  const { showUpgradeModal, setShowUpgradeModal, setUpgradeMessage } = useUpgrade();

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle file drop
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

  // Remove a file from the list
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Remove all files
  const removeAllFiles = () => {
    setFiles([]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsProcessing(true);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('language', language);
    formData.append('dpi', dpi);
    formData.append('output_format', outputFormat);

    try {
      const response = await fetch(`${API_BASE_URL}/api/pdf-scan`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check for premium restriction
        if (response.status === 403 && errorData.show_upgrade) {
          setUpgradeMessage(errorData.error || "This feature requires a premium subscription.");
          setShowUpgradeModal(true);
          setIsProcessing(false);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to scan PDF');
      }

      // Get the filename from the Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'scanned_pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error scanning PDF:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Navigation
  const goBack = () => {
    router.push('/');
  };

  // Styles
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    title: {
      fontSize: '36px',
      fontWeight: '800',
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
      padding: '12px 16px',
      background: '#f8f9ff',
      borderRadius: '12px',
      marginBottom: '8px'
    },
    fileIcon: {
      fontSize: '24px',
      marginRight: '12px'
    },
    fileName: {
      flex: 1,
      fontSize: '16px',
      color: '#333',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    fileSize: {
      fontSize: '14px',
      color: '#666',
      marginRight: '16px'
    },
    removeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px',
      color: '#666666',
      padding: '4px'
    },
    settingsSection: {
      marginTop: '24px',
      background: '#f8f9ff',
      padding: '24px',
      borderRadius: '16px'
    },
    settingsTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '16px'
    },
    settingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px'
    },
    settingGroup: {
      marginBottom: '16px'
    },
    settingLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '8px'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid #ddd',
      fontSize: '16px',
      color: '#333',
      background: 'white'
    },
    noteText: {
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
      background: '#f5f5f5',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '24px'
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
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 16px',
      background: 'none',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      color: '#666',
      cursor: 'pointer',
      marginBottom: '24px'
    },
    backIcon: {
      marginRight: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <style>{spinKeyframes}</style>
      
      <button onClick={goBack} style={styles.backButton}>
        <span style={styles.backIcon}>←</span> Back to Tools
      </button>
      
      <header style={styles.header}>
        <h1 style={styles.title}>PDF OCR Scanner</h1>
        <p style={styles.subtitle}>Extract text from scanned PDFs using OCR technology</p>
      </header>
      
      <div style={styles.card}>
        <div style={styles.section}>
          <div style={styles.instructions}>
            <h3 style={styles.instructionTitle}>How to use:</h3>
            <ul style={styles.instructionList}>
              <li>Upload one or more scanned PDF files</li>
              <li>Select the language of the text in your PDFs</li>
              <li>Adjust DPI settings for better recognition if needed</li>
              <li>Click "Scan PDFs" to extract text</li>
              <li>Download the extracted text files</li>
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
              Select scanned PDF files to extract text
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
                  <span style={styles.fileName}>{file.name}</span>
                  <span style={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <button
                    onClick={() => removeFile(index)}
                    style={styles.removeButton}
                    title="Remove file"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
          
          {files.length > 0 && (
            <div style={styles.settingsSection}>
              <h3 style={styles.settingsTitle}>OCR Settings</h3>
              <div style={styles.settingsGrid}>
                <div style={styles.settingGroup}>
                  <label style={styles.settingLabel}>Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    style={styles.select}
                  >
                    <option value="eng">English</option>
                    <option value="fra">French</option>
                    <option value="deu">German</option>
                    <option value="spa">Spanish</option>
                    <option value="ita">Italian</option>
                    <option value="por">Portuguese</option>
                    <option value="rus">Russian</option>
                    <option value="jpn">Japanese</option>
                    <option value="chi_sim">Chinese (Simplified)</option>
                    <option value="chi_tra">Chinese (Traditional)</option>
                    <option value="kor">Korean</option>
                    <option value="ara">Arabic</option>
                  </select>
                  <p style={styles.noteText}>Select the primary language in your document</p>
                </div>
                
                <div style={styles.settingGroup}>
                  <label style={styles.settingLabel}>DPI (Resolution)</label>
                  <select
                    value={dpi}
                    onChange={(e) => setDpi(Number(e.target.value))}
                    style={styles.select}
                  >
                    <option value="150">150 DPI (Faster)</option>
                    <option value="300">300 DPI (Recommended)</option>
                    <option value="600">600 DPI (Higher Quality)</option>
                  </select>
                  <p style={styles.noteText}>Higher DPI improves accuracy but takes longer</p>
                </div>
                
                <div style={styles.settingGroup}>
                  <label style={styles.settingLabel}>Output Format</label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    style={styles.select}
                  >
                    <option value="txt">Plain Text (.txt)</option>
                  </select>
                  <p style={styles.noteText}>Format of the extracted text</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div style={styles.actionSection}>
          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || isProcessing}
            style={{
              ...styles.processButton,
              opacity: files.length === 0 || isProcessing ? 0.7 : 1,
              cursor: files.length === 0 || isProcessing ? 'not-allowed' : 'pointer'
            }}
          >
            {isProcessing ? (
              <>
                <div style={styles.spinner}></div>
                Processing...
              </>
            ) : (
              <>
                <span style={{ fontSize: '24px', marginRight: '12px' }}>🔍</span>
                Scan {files.length} PDF{files.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Upgrade Modal is now handled by the global context */}
    </div>
  );
}