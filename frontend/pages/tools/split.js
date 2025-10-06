"use client";

// --- Premium modal handling injected ---
function useUpgradeModal() {
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  return { showModal, setShowModal, modalMsg, setModalMsg };
}

import { useState } from 'react';
import UpgradeModal from '../../components/UpgradeModal';
import { API_BASE_URL } from '../../components/config';

export default function SplitPage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');
  const [splitOptions, setSplitOptions] = useState({
    mode: 'all',
    startPage: '',
    endPage: '',
    customPages: ''
  });

  // Function to close the upgrade modal
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
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
      setFile(droppedFiles[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a PDF file to split");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      if (splitOptions.mode === 'range') {
        if (splitOptions.startPage) formData.append("start_page", splitOptions.startPage);
        if (splitOptions.endPage) formData.append("end_page", splitOptions.endPage);
      } else if (splitOptions.mode === 'custom') {
        formData.append("custom_pages", splitOptions.customPages);
      }

      const response = await fetch(`${API_BASE_URL}/api/split`, {
        method: "POST",
        body: formData,
      });

      // Check for error responses (including 403)
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          
          // Check if it's a restriction error with upgrade option
          if (response.status === 403 && errorData.show_upgrade) {
            setUpgradeMessage(errorData.error || errorData.message);
            setShowUpgradeModal(true);
            return;
          }
          
          // Otherwise throw a generic error
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "split_pages.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      
      // Show upgrade modal for free users instead of generic error
      setUpgradeMessage("Upgrade to premium to split PDF files of any size with unlimited page operations.");
      setShowUpgradeModal(true);
      // Don't show any error alert, just the modal
    } finally {
      if (!showUpgradeModal) {
        setIsProcessing(false);
      }
    }
  };

  const goBack = () => {
    window.location.href = "/";
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f3f3f3 0%, #e3e3e3 100%)',
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
      borderBottom: '1px solid #f3f3f3'
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
      background: dragActive ? '#f3f3f3' : '#fafafa'
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
      background: file ? '#f3f3f3' : '#f0f0f0'
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
    fileDisplay: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      background: '#f3f3f3',
      border: '2px solid #e3e3e3',
      borderRadius: '12px',
      marginTop: '20px'
    },
    fileIcon: {
      marginRight: '16px',
      fontSize: '32px'
    },
    fileInfo: {
      flex: 1
    },
    fileName: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '4px'
    },
    fileSize: {
      fontSize: '14px',
      color: '#999'
    },
    removeButton: {
      background: '#666666',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    optionsSection: {
      padding: '32px',
      borderBottom: '1px solid #f3f3f3'
    },
    optionsTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    optionGroup: {
      marginBottom: '24px'
    },
    radioOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px',
      border: '2px solid #e3e3e3',
      borderRadius: '12px',
      marginBottom: '12px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'white'
    },
    radioOptionActive: {
      borderColor: '#666666',
      background: '#f3f3f3'
    },
    radioInput: {
      marginRight: '16px',
      transform: 'scale(1.2)'
    },
    optionContent: {
      flex: 1
    },
    optionTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '4px'
    },
    optionDesc: {
      fontSize: '14px',
      color: '#666'
    },
    rangeInputs: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      marginTop: '16px',
      flexWrap: 'wrap'
    },
    rangeLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333333'
    },
    rangeInput: {
      width: '80px',
      padding: '8px 12px',
      border: '2px solid #e3e3e3',
      borderRadius: '8px',
      fontSize: '14px',
      textAlign: 'center'
    },
    customInput: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e3e3e3',
      borderRadius: '8px',
      fontSize: '16px',
      marginTop: '12px'
    },
    actionSection: {
      padding: '32px',
      textAlign: 'center'
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
      background: file ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: file ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
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
      background: '#f3f3f3',
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
      {/* Upgrade Modal at the top */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50">
          <UpgradeModal 
            message={upgradeMessage} 
            onClose={closeUpgradeModal} 
          />
        </div>
      )}

      <div style={styles.container}>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinner { animation: spin 1s linear infinite; }
          button:hover:not(:disabled) { transform: translateY(-2px); }
          input:focus { outline: none; border-color: #666666; }
        `}</style>

        <div style={styles.maxWidth}>
          <button onClick={goBack} style={styles.backButton}>
            ← Back to Home
          </button>

          <div style={styles.header}>
            <div style={styles.headerIcon}>
              <span>✂️</span>
            </div>
            <h1 style={styles.title}>Split PDF</h1>
            <p style={styles.subtitle}>Split PDF into separate pages or page ranges</p>
          </div>

          <div style={styles.card}>
            <div style={styles.section}>
              <div style={styles.instructions}>
                <h3 style={styles.instructionTitle}>✂️ How to Split PDFs:</h3>
                <ul style={styles.instructionList}>
                  <li>Select a single PDF file to split</li>
                  <li>Choose your splitting method (all pages, page range, or custom pages)</li>
                  <li>For page ranges: enter start and end page numbers</li>
                  <li>For custom pages: enter specific page numbers (e.g., 1,3,5-8,10)</li>
                  <li>Click "Split PDF" to generate separate files</li>
                </ul>
              </div>

              <h2 style={styles.sectionTitle}>
                <span style={{ fontSize: '28px', marginRight: '12px' }}>📁</span>
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
                  {file ? '📄' : '📁'}
                </div>
                
                <p style={styles.uploadText}>
                  {file ? 'PDF file selected' : 'Drop PDF file here or click to browse'}
                </p>
                <p style={styles.uploadSubtext}>
                  Select one PDF file to split
                </p>
              </div>

              {file && (
                <div style={styles.fileDisplay}>
                  <span style={styles.fileIcon}>📄</span>
                  <div style={styles.fileInfo}>
                    <div style={styles.fileName}>{file.name}</div>
                    <div style={styles.fileSize}>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <button onClick={removeFile} style={styles.removeButton}>
                    Remove
                  </button>
                </div>
              )}
            </div>

            {file && (
              <div style={styles.optionsSection}>
                <h2 style={styles.optionsTitle}>
                  <span style={{ fontSize: '28px', marginRight: '12px' }}>⚙️</span>
                  Split Options
                </h2>

                <div style={styles.optionGroup}>
                  <div 
                    style={{
                      ...styles.radioOption,
                      ...(splitOptions.mode === 'all' ? styles.radioOptionActive : {})
                    }}
                    onClick={() => setSplitOptions({...splitOptions, mode: 'all'})}
                  >
                    <input
                      type="radio"
                      name="splitMode"
                      value="all"
                      checked={splitOptions.mode === 'all'}
                      onChange={() => setSplitOptions({...splitOptions, mode: 'all'})}
                      style={styles.radioInput}
                    />
                    <div style={styles.optionContent}>
                      <div style={styles.optionTitle}>Split All Pages</div>
                      <div style={styles.optionDesc}>Create separate files for each page</div>
                    </div>
                  </div>

                  <div 
                    style={{
                      ...styles.radioOption,
                      ...(splitOptions.mode === 'range' ? styles.radioOptionActive : {})
                    }}
                    onClick={() => setSplitOptions({...splitOptions, mode: 'range'})}
                  >
                    <input
                      type="radio"
                      name="splitMode"
                      value="range"
                      checked={splitOptions.mode === 'range'}
                      onChange={() => setSplitOptions({...splitOptions, mode: 'range'})}
                      style={styles.radioInput}
                    />
                    <div style={styles.optionContent}>
                      <div style={styles.optionTitle}>Split Page Range</div>
                      <div style={styles.optionDesc}>Extract a specific range of pages</div>
                      {splitOptions.mode === 'range' && (
                        <div style={styles.rangeInputs}>
                          <span style={styles.rangeLabel}>From page:</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="1"
                            value={splitOptions.startPage}
                            onChange={(e) => setSplitOptions({...splitOptions, startPage: e.target.value})}
                            style={styles.rangeInput}
                          />
                          <span style={styles.rangeLabel}>To page:</span>
                          <input
                            type="number"
                            min="1"
                            placeholder="Last"
                            value={splitOptions.endPage}
                            onChange={(e) => setSplitOptions({...splitOptions, endPage: e.target.value})}
                            style={styles.rangeInput}
                          />
                          <span style={{fontSize: '12px', color: '#999'}}>
                            Leave "To page" empty for last page
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div 
                    style={{
                      ...styles.radioOption,
                      ...(splitOptions.mode === 'custom' ? styles.radioOptionActive : {})
                    }}
                    onClick={() => setSplitOptions({...splitOptions, mode: 'custom'})}
                  >
                    <input
                      type="radio"
                      name="splitMode"
                      value="custom"
                      checked={splitOptions.mode === 'custom'}
                      onChange={() => setSplitOptions({...splitOptions, mode: 'custom'})}
                      style={styles.radioInput}
                    />
                    <div style={styles.optionContent}>
                      <div style={styles.optionTitle}>Custom Pages</div>
                      <div style={styles.optionDesc}>Specify exact pages to extract</div>
                      {splitOptions.mode === 'custom' && (
                        <input
                          type="text"
                          placeholder="e.g., 1,3,5-8,10,15-20"
                          value={splitOptions.customPages}
                          onChange={(e) => setSplitOptions({...splitOptions, customPages: e.target.value})}
                          style={styles.customInput}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div style={styles.actionSection}>
              <button
                onClick={handleSubmit}
                disabled={!file || isProcessing}
                style={styles.processButton}
              >
                {isProcessing ? (
                  <>
                    <div className="spinner" style={styles.spinner}></div>
                    Splitting PDF...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: '24px', marginRight: '12px' }}>✂️</span>
                    Split PDF
                  </>
                )}
              </button>
              
              {!file && (
                <p style={{ color: '#666', marginTop: '12px' }}>
                  Please select a PDF file to split
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Upgrade Modal - Inline implementation */}
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
      </div>
    </>
  );
}

// No need to define UpgradeModalRenderer here as it's already imported from UpgradeModal.js