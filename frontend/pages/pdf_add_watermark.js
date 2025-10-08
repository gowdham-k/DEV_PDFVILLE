import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../components/config";
import HubspotTracking, { trackEvent } from "../components/HubspotTracking";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useUpgrade } from "../context/UpgradeContext";

// Dynamic imports for better code splitting
const FileUploadArea = dynamic(() => import("../components/FileUploadArea"), {
  loading: () => <div>Loading file upload component...</div>,
  ssr: false
});

const WatermarkSettings = dynamic(() => import("../components/WatermarkSettings"), {
  loading: () => <div>Loading watermark settings...</div>
});

// Constants for default values and configuration
const DEFAULT_SETTINGS = {
  text: "CONFIDENTIAL",
  opacity: 0.3,
  position: "center",
  rotation: 45,
  color: "#FF0000",
  fontSize: 48
};

const ERROR_TIMEOUT = 5000;

/**
 * PDF Watermark Page Component
 * Allows users to add text watermarks to PDF documents
 */
export default function WatermarkPage() {
  const router = useRouter();
  
  // File state
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Watermark settings state
  const [watermarkSettings, setWatermarkSettings] = useState({
    text: DEFAULT_SETTINGS.text,
    opacity: DEFAULT_SETTINGS.opacity,
    position: DEFAULT_SETTINGS.position,
    rotation: DEFAULT_SETTINGS.rotation,
    color: DEFAULT_SETTINGS.color,
    fontSize: DEFAULT_SETTINGS.fontSize
  });
  
  // Error handling
  const [errorMessage, setErrorMessage] = useState("");
  
  // Use global upgrade context
  const { showUpgradeModal, setShowUpgradeModal, upgradeMessage, setUpgradeMessage } = useUpgrade();

  // Clear error message after timeout
  useEffect(() => {
    if (!errorMessage) return;
    
    const timer = setTimeout(() => {
      setErrorMessage("");
    }, ERROR_TIMEOUT);
    
    return () => clearTimeout(timer);
  }, [errorMessage]);

  // Memoized derived values
  const isFormValid = useMemo(() => 
    files.length > 0 && watermarkSettings.text.trim().length > 0,
  [files.length, watermarkSettings.text]);

  // Event handlers with useCallback for better performance
  const handleFileChange = useCallback((e) => {
    setFiles(Array.from(e.target.files));
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  }, []);

  const removeFile = useCallback((index) => {
    setFiles(files => files.filter((_, i) => i !== index));
  }, []);

  const removeAllFiles = useCallback(() => {
    setFiles([]);
  }, []);

  // Update watermark settings with a single function
  const updateWatermarkSetting = useCallback((key, value) => {
    setWatermarkSettings(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const goBack = useCallback(() => {
    router.push("/");
  }, [router]);

  // Process the watermark request
  const handleSubmit = useCallback(async () => {
    // Validation
    if (files.length === 0) {
      setErrorMessage("Please select at least 1 PDF file to add watermark");
      return;
    }

    if (!watermarkSettings.text.trim()) {
      setErrorMessage("Please enter watermark text");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      
      // Add files to form data
      files.forEach(file => {
        formData.append("files", file);
      });
      
      // Add watermark settings to form data
      formData.append("watermark_text", watermarkSettings.text);
      formData.append("opacity", watermarkSettings.opacity.toString());
      formData.append("position", watermarkSettings.position);
      formData.append("rotation", watermarkSettings.rotation.toString());
      formData.append("color", watermarkSettings.color);
      formData.append("font_size", watermarkSettings.fontSize.toString());
      
      const response = await fetch(`${API_BASE_URL}/api/pdf-add-watermark`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle premium restriction error
        if (response.status === 403 && errorData.show_upgrade) {
          setUpgradeMessage(errorData.error || "This feature requires a premium subscription");
          setShowUpgradeModal(true);
          return;
        }
        
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      // Process successful response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files.length === 1 ? `watermarked_${files[0].name}` : "watermarked_pdfs.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error processing watermark:', error);
      
      // Set user-friendly error message
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        setErrorMessage("Connection error: Unable to reach the server. Please check your internet connection and try again.");
      } else {
        setErrorMessage("Error: " + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [files, watermarkSettings, setUpgradeMessage, setShowUpgradeModal]);

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
    watermarkSettings: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginTop: '24px'
    },
    settingGroup: {
      background: '#f8f9ff',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #f0f0f0'
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
      transition: 'border-color 0.2s ease'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '2px solid #f0f0f0',
      borderRadius: '8px',
      fontSize: '16px',
      color: '#333333',
      background: 'white',
      cursor: 'pointer'
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    rangeInput: {
      flex: 1,
      height: '8px',
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
      background: files.length > 0 && watermarkText.trim() ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: files.length > 0 && watermarkText.trim() ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
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
        {errorMessage && (
          <div style={{
            width: '100%',
            padding: '16px',
            marginBottom: '16px',
            backgroundColor: '#f44336',
            color: 'white',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {errorMessage}
          </div>
        )}
        <button onClick={goBack} style={styles.backButton}>
          ← Back to Home
        </button>

        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span>💧</span>
          </div>
          <h1 style={styles.title}>Add Watermark</h1>
          <p style={styles.subtitle}>Add text watermarks to your PDF documents</p>
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.instructions}>
              <h3 style={styles.instructionTitle}>💧 How to Add Watermark:</h3>
              <ul style={styles.instructionList}>
                <li>Select or drop PDF files to add watermarks to</li>
                <li>Customize your watermark text, position, color, and other settings</li>
                <li>Click "Add Watermark" to process your files</li>
                <li>Download the watermarked PDFs automatically</li>
              </ul>
            </div>

            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>📁</span>
              Select PDF Files
            </h2>
            
            <FileUploadArea 
              files={files}
              setFiles={setFiles}
              acceptTypes=".pdf"
              uploadText="Drop PDF files here or click to browse"
              uploadSubtext="Select PDF files to add watermark"
              onRemoveFile={removeFile}
              onRemoveAllFiles={removeAllFiles}
            />
          </div>

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>💧</span>
              Watermark Settings
            </h2>

            <WatermarkSettings 
              settings={watermarkSettings} 
              updateSetting={updateWatermarkSetting} 
            />
          </div>

          <div style={styles.actionSection}>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isProcessing}
              style={{
                ...styles.processButton,
                background: isFormValid && !isProcessing 
                  ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' 
                  : '#ccc',
                boxShadow: isFormValid && !isProcessing 
                  ? '0 10px 30px rgba(102, 102, 102, 0.4)' 
                  : 'none'
              }}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" style={styles.spinner}></div>
                  Adding Watermark...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>💧</span>
                  Add Watermark to {files.length} PDF{files.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
            
            {!isFormValid && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                {files.length === 0 ? 'Please select PDF files' : 'Please enter watermark text'}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <Head>
        <title>Add Watermark to PDF | PDF Tools</title>
        <meta name="description" content="Add text watermarks to your PDF documents with customizable position, opacity, color, and more." />
      </Head>
    </div>
  );
}

// Remove unused component
// export function UpgradeModalRenderer({ show, msg, onClose }) {
//   if (!show) return null;
//   return <UpgradeModal message={msg} onClose={onClose} />;
// }