import { useState } from "react";
import UpgradeModal from "../components/UpgradeModal";
import { API_BASE_URL } from "../components/config";

// --- Premium modal handling injected ---
function useUpgradeModal() {
  const [showModal, setShowModal] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  return { showModal, setShowModal, modalMsg, setModalMsg };
}

// Define keyframes for spinner animation
const spinKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export default function RepairPDFPage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [repairMode, setRepairMode] = useState("auto");
  const [preserveBookmarks, setPreserveBookmarks] = useState(true);
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const { showModal, setShowModal, modalMsg, setModalMsg } = useUpgradeModal();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).filter(
      file => file.type === 'application/pdf'
    );
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
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
      alert("Please select at least 1 PDF file to repair");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });
      
      formData.append("repair_mode", repairMode);
      formData.append("preserve_bookmarks", preserveBookmarks.toString());
      formData.append("preserve_metadata", preserveMetadata.toString());

      const response = await fetch(`${API_BASE_URL}/api/pdf-repair`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files.length === 1 ? `repaired_${files[0].name}` : "repaired_pdfs.zip";
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Clear files after successful processing
      setFiles([]);
      
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
    }
  };

  return (
    <div style={styles.container}>
      <style dangerouslySetInnerHTML={{ __html: spinKeyframes }} />
      {showModal && <UpgradeModal message={modalMsg} onClose={() => setShowModal(false)} />}
      <div style={styles.maxWidth}>
        {/* Back Button */}
        <button 
          onClick={goBack}
          style={styles.backButton}
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span>{'🔧'}</span>
          </div>
          <h1 style={styles.title}>Repair PDF</h1>
          <p style={styles.subtitle}>Fix corrupted or damaged PDF documents</p>
        </div>

        {/* Main Card */}
        <div style={styles.card}>
          
          {/* Instructions Section */}
          <div style={styles.section}>
            <div style={{background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '24px'}}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-3">{'📖'}</span>
                How to Repair PDF Files:
              </h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-1">
                <li>• Upload corrupted or damaged PDF files</li>
                <li>• Choose repair mode (auto-detect issues or force rebuild)</li>
                <li>• Select whether to preserve bookmarks and metadata</li>
                <li>• Our tool will attempt to fix structural problems</li>
                <li>• Download your repaired PDF files</li>
              </ul>
            </div>

            <div style={{background: '#fff9e6', padding: '16px', borderRadius: '12px', border: '1px solid #ffe58f', marginBottom: '24px'}}>
              <h4 className="text-base font-semibold text-yellow-800 mb-2 flex items-center">
                <span className="mr-2">{'⚠'}</span>
                Important Note:
              </h4>
              <p className="text-yellow-700 text-sm">
                PDF repair success depends on the type and extent of corruption. Some heavily damaged files may not be fully recoverable.
              </p>
            </div>

            {/* File Upload Section */}
            <h2 style={styles.sectionTitle}>
              <span style={{fontSize: '28px', marginRight: '12px'}}>{'📁'}</span>
              Select Damaged PDF Files
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
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: 'pointer'
                }}
              />
              
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '32px',
                background: files.length > 0 ? '#f0f0f0' : '#e0e0e0'
              }}>
                {files.length > 0 ? '📄' : '📁'}
              </div>
              
              <p style={{
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#333333'
              }}>
                {files.length > 0 ? `${files.length} files selected` : 'Drop damaged PDF files here or click to browse'}
              </p>
              <p style={{ color: '#666666' }}>
                Support for corrupted or damaged PDF files
              </p>
            </div>

            {/* Files List */}
            {files.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <button 
                    onClick={removeAllFiles}
                    style={{
                      padding: '12px 24px',
                      background: '#666666',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {'🗑️'} Remove All Files
                  </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {files.map((file, index) => (
                    <div 
                      key={`${file.name}-${index}`} 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        background: 'rgba(240, 249, 255, 0.5)',
                        border: '2px solid #e0e0e0',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '24px', marginRight: '16px' }}>{'📄'}</span>
                      <span style={{ flex: 1, color: '#333333', fontWeight: '500' }}>
                        {index + 1}. {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        style={{
                          fontSize: '20px',
                          color: '#666666',
                          padding: '4px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease'
                        }}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Repair Settings */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={{fontSize: '28px', marginRight: '12px'}}>{'⚙️'}</span>
              Repair Settings
            </h2>

            <div style={{ background: 'rgba(240, 249, 255, 0.5)', padding: '24px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
              {/* Repair Mode */}
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#333333', marginBottom: '12px' }}>
                Repair Mode
              </label>
              <select
                value={repairMode}
                onChange={(e) => setRepairMode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#333333',
                  background: 'white',
                  marginBottom: '16px',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <option value="auto">{'🔍'} Auto-detect and fix issues</option>
                <option value="rebuild">{'🔧'} Force rebuild PDF structure</option>
                <option value="minimal">{'🛠️'} Minimal repair (fastest)</option>
                <option value="deep">{'🔎'} Deep scan and repair (thorough)</option>
              </select>
              <p style={{ fontSize: '14px', color: '#666666', marginBottom: '16px' }}>
                Auto-detect mode analyzes the PDF and applies appropriate fixes. Rebuild mode reconstructs the entire PDF structure.
              </p>

              {/* Preservation Options */}
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#333333', marginBottom: '12px' }}>
                Preservation Options
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preserveBookmarks}
                    onChange={(e) => setPreserveBookmarks(e.target.checked)}
                    style={{ marginRight: '12px', height: '16px', width: '16px' }}
                  />
                  <span style={{ color: '#333333' }}>{'🔖'} Preserve bookmarks and navigation</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preserveMetadata}
                    onChange={(e) => setPreserveMetadata(e.target.checked)}
                    style={{ marginRight: '12px', height: '16px', width: '16px' }}
                  />
                  <span style={{ color: '#333333' }}>{'📊'} Preserve document metadata</span>
                </label>
              </div>
              
              <p style={{ fontSize: '14px', color: '#666666', marginTop: '12px', fontStyle: 'italic' }}>
                Note: Some preservation options may not be possible with severely damaged files
              </p>
            </div>
          </div>

          {/* Action Section */}
          <div style={styles.section}>
            <button
              onClick={handleSubmit}
              disabled={files.length === 0 || isProcessing}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '20px 32px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                cursor: files.length > 0 && !isProcessing ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
                background: files.length > 0 && !isProcessing 
                  ? 'linear-gradient(to right, #666666, #444444)'
                  : '#aaaaaa',
                boxShadow: files.length > 0 && !isProcessing ? '0 10px 30px rgba(0, 0, 0, 0.15)' : 'none'
              }}
            >
              {isProcessing ? (
                <>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '12px'
                  }}></div>
                  Repairing PDFs...
                </>
              
              ) : (
                <>
                  <span className="text-2xl mr-3">{'🔧'}</span>
                  Repair {files.length} PDF{files.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
            
            {files.length === 0 && !isProcessing && (
              <p style={{ color: '#777777', marginTop: '12px' }}>
                Please select PDF files to repair
              </p>
            )}
            
            {files.length > 0 && !isProcessing && (
              <p style={{ fontSize: '14px', color: '#666666', marginTop: '16px', maxWidth: '400px', margin: '16px auto 0' }}>
                The repair process may take longer for severely damaged files. Please be patient while we attempt to restore your documents.
              </p>
            )}
          </div>
        </div>
      </div>


    </div>
  );
}