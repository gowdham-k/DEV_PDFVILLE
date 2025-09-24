import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import UpgradeModal from "../components/UpgradeModal";
import { API_BASE_URL } from "../components/config";

// --- Premium modal handling ---
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

export default function TranslatePdfPage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [errorMessage, setErrorMessage] = useState("");
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [translateMode, setTranslateMode] = useState("auto");
  const { showModal, setShowModal, modalMsg, setModalMsg } = useUpgradeModal();

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
      file => file.name.toLowerCase().endsWith('.pdf')
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
      file => file.name.toLowerCase().endsWith('.pdf')
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
      setErrorMessage("Please select at least 1 PDF file to translate");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append("files", file);
      });
      
      formData.append("target_language", targetLanguage);
      formData.append("preserve_formatting", preserveFormatting.toString());
      formData.append("translate_mode", translateMode);

      const response = await fetch(`${API_BASE_URL}/api/translate-pdf`, {
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
      a.download = files.length === 1 ? `translated_${files[0].name}` : "translated_pdfs.zip";
      a.click();
      window.URL.revokeObjectURL(url);
      
      // Clear files after successful processing
      setFiles([]);
      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || "Failed to translate PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    window.location.href = "/";
  };

  // Language options
  const languageOptions = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ru", name: "Russian" },
    { code: "zh-cn", name: "Chinese (Simplified)" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "ar", name: "Arabic" },
    { code: "hi", name: "Hindi" },
    { code: "th", name: "Thai" },
    { code: "vi", name: "Vietnamese" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "tr", name: "Turkish" }
  ];

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
      border: '2px solid #4F46E5',
      borderRadius: '12px',
      color: '#4F46E5',
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
      background: '#4F46E5',
      borderRadius: '20px',
      marginBottom: '16px',
      boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)',
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
      boxShadow: '0 20px 60px rgba(79, 70, 229, 0.15)',
      overflow: 'hidden',
      border: '1px solid rgba(79, 70, 229, 0.1)'
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
      border: '3px dashed #4F46E5',
      borderRadius: '16px',
      padding: '48px 32px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      background: dragActive ? '#f5f5f5' : '#f8f9ff'
    },
    errorMessage: {
      background: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '24px',
      textAlign: 'center'
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
            <span>🌐</span>
          </div>
          <h1 style={styles.title}>Translate PDF</h1>
          <p style={styles.subtitle}>Translate PDF documents to different languages</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div style={styles.errorMessage}>
            {errorMessage}
          </div>
        )}

        {/* Main Card */}
        <div style={styles.card}>
          
          {/* Instructions Section */}
          <div style={styles.section}>
            <div style={{background: '#f9f9f9', padding: '20px', borderRadius: '12px', border: '1px solid #e0e0e0', marginBottom: '24px'}}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-3">📖</span>
                How to Translate PDF Files:
              </h3>
              <ul className="text-gray-600 text-sm leading-relaxed space-y-1">
                <li>• Upload PDF files you want to translate</li>
                <li>• Select the target language for translation</li>
                <li>• Choose translation mode and formatting options</li>
                <li>• Our AI will translate while preserving layout</li>
                <li>• Download your translated PDF files</li>
              </ul>
            </div>

            <div style={{background: '#fff9e6', padding: '16px', borderRadius: '12px', border: '1px solid #ffe58f', marginBottom: '24px'}}>
              <h4 className="text-base font-semibold text-yellow-800 mb-2 flex items-center">
                <span className="mr-2">⚠</span>
                Translation Notes:
              </h4>
              <p className="text-yellow-700 text-sm">
                Translation quality depends on text clarity. Scanned PDFs or complex layouts may require additional processing time.
              </p>
            </div>

            {/* File Upload Section */}
            <h2 style={styles.sectionTitle}>
              <span style={{fontSize: '28px', marginRight: '12px'}}>📁</span>
              Select PDF Files to Translate
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
                {files.length > 0 ? `${files.length} files selected` : 'Drop PDF files here or click to browse'}
              </p>
              <p style={{ color: '#666666' }}>
                Support for text-based PDF documents
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
                      background: '#4F46E5',
                      color: 'white',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    🗑️ Remove All Files
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
                      <span style={{ fontSize: '24px', marginRight: '16px' }}>📄</span>
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

          {/* Translation Settings */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={{fontSize: '28px', marginRight: '12px'}}>⚙️</span>
              Translation Settings
            </h2>

            <div style={{ background: 'rgba(240, 249, 255, 0.5)', padding: '24px', borderRadius: '12px', border: '1px solid #e0e0e0' }}>
              {/* Target Language */}
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#333333', marginBottom: '12px' }}>
                Target Language
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
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
                {languageOptions.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>

              {/* Translation Mode */}
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#333333', marginBottom: '12px' }}>
                Translation Mode
              </label>
              <select
                value={translateMode}
                onChange={(e) => setTranslateMode(e.target.value)}
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
                <option value="auto">🤖 Automatic (recommended)</option>
                <option value="precise">🎯 Precise translation</option>
                <option value="natural">💬 Natural language</option>
                <option value="technical">🔬 Technical documents</option>
              </select>

              {/* Formatting Options */}
              <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#333333', marginBottom: '12px' }}>
                Formatting Options
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={preserveFormatting}
                    onChange={(e) => setPreserveFormatting(e.target.checked)}
                    style={{ marginRight: '12px', height: '16px', width: '16px' }}
                  />
                  <span style={{ color: '#333333' }}>📐 Preserve document layout and formatting</span>
                </label>
              </div>
              
              <p style={{ fontSize: '14px', color: '#666666', marginTop: '12px', fontStyle: 'italic' }}>
                Layout preservation may affect translation accuracy for complex documents
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
                  ? 'linear-gradient(to right, #4F46E5, #7C3AED)'
                  : '#aaaaaa',
                boxShadow: files.length > 0 && !isProcessing ? '0 10px 30px rgba(79, 70, 229, 0.3)' : 'none'
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
                  Translating PDFs...
                </>
              
              ) : (
                <>
                  <span className="text-2xl mr-3">🌐</span>
                  Translate {files.length} PDF{files.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
            
            {files.length === 0 && !isProcessing && (
              <p style={{ color: '#777777', marginTop: '12px' }}>
                Please select PDF files to translate
              </p>
            )}
            
            {files.length > 0 && !isProcessing && (
              <p style={{ fontSize: '14px', color: '#666666', marginTop: '16px', maxWidth: '400px', margin: '16px auto 0' }}>
                Translation may take longer for complex documents with images or special formatting.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}