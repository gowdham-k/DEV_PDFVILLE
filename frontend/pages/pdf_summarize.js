import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../components/config";
import HubspotTracking, { trackEvent } from "../components/HubspotTracking";
import Head from "next/head";
import { useUpgrade } from "../context/UpgradeContext";
import Button from "../components/Button";

export default function SummarizePage() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [summaryRatio, setSummaryRatio] = useState(0.3);
  const [summary, setSummary] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Use global upgrade context
  const { showUpgradeModal, setShowUpgradeModal, upgradeMessage, setUpgradeMessage } = useUpgrade();
  
  // Close upgrade modal
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

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
    setFiles(Array.from(e.target.files));
    setSummary(""); // Clear previous summary
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
      setSummary(""); // Clear previous summary
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setErrorMessage("Please select a PDF file to summarize.");
      return;
    }

    // Track event
    trackEvent('pdf_summarize_started');
    
    setIsProcessing(true);
    setSummary("");
    
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('summary_ratio', summaryRatio);
      
      const response = await fetch(`${API_BASE_URL}/api/summarize_pdf`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.show_upgrade) {
          setUpgradeMessage(data.error || "You need to upgrade to use this feature.");
          setShowUpgradeModal(true);
        } else {
          setErrorMessage(data.error || "Failed to summarize PDF.");
        }
        setIsProcessing(false);
        return;
      }
      
      setSummary(data.summary);
      trackEvent('pdf_summarize_completed');
      
    } catch (error) {
      console.error("Error summarizing PDF:", error);
      setErrorMessage("An error occurred while summarizing the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem 1rem',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#666',
      maxWidth: '800px',
      margin: '0 auto',
    },
    form: {
      marginTop: '2rem',
    },
    fileUpload: {
      border: '2px dashed #ccc',
      borderRadius: '8px',
      padding: '2rem',
      textAlign: 'center',
      marginBottom: '2rem',
      backgroundColor: dragActive ? '#f0f9ff' : '#f9f9f9',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    fileUploadActive: {
      borderColor: '#3498db',
      backgroundColor: '#f0f9ff',
    },
    fileInput: {
      display: 'none',
    },
    uploadIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      color: '#3498db',
    },
    uploadText: {
      fontSize: '1.2rem',
      color: '#666',
      marginBottom: '0.5rem',
    },
    uploadSubtext: {
      fontSize: '0.9rem',
      color: '#999',
    },
    settingsContainer: {
      marginBottom: '2rem',
      padding: '1.5rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    settingsTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
    },
    settingsRow: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '1rem',
    },
    settingsLabel: {
      fontSize: '1rem',
      marginBottom: '0.5rem',
      color: '#555',
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    range: {
      flex: 1,
      height: '8px',
      WebkitAppearance: 'none',
      appearance: 'none',
      borderRadius: '5px',
      background: '#ddd',
      outline: 'none',
    },
    rangeValue: {
      minWidth: '60px',
      textAlign: 'center',
      padding: '0.25rem 0.5rem',
      backgroundColor: '#3498db',
      color: 'white',
      borderRadius: '4px',
      fontSize: '0.9rem',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '2rem',
    },
    summaryContainer: {
      marginTop: '2rem',
      padding: '1.5rem',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    summaryTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
    },
    summaryText: {
      fontSize: '1rem',
      lineHeight: '1.6',
      color: '#333',
      whiteSpace: 'pre-wrap',
    },
    errorMessage: {
      backgroundColor: '#ffebee',
      color: '#c62828',
      padding: '0.75rem',
      borderRadius: '4px',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '2rem',
    },
    spinner: {
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderLeft: '4px solid #3498db',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      animation: 'spin 1s linear infinite',
    },
    '@keyframes spin': {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    fileInfo: {
      marginTop: '1rem',
      padding: '0.5rem',
      backgroundColor: '#e8f4fd',
      borderRadius: '4px',
      fontSize: '0.9rem',
      color: '#2980b9',
    },
  };

  return (
    <div>
      <Head>
        <title>PDF Summarizer - Extract Key Information from Your PDF</title>
        <meta name="description" content="Summarize your PDF documents automatically. Extract the most important information from your PDFs with our AI-powered summarization tool." />
        <meta name="keywords" content="PDF summarizer, PDF summary, extract PDF information, PDF key points, PDF AI summary" />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </Head>

      <HubspotTracking />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>PDF Summarizer</h1>
          <p style={styles.subtitle}>
            Extract the most important information from your PDF documents automatically.
            Our AI-powered tool analyzes your document and creates a concise summary.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {errorMessage && (
            <div style={styles.errorMessage}>{errorMessage}</div>
          )}

          <div 
            style={{
              ...styles.fileUpload,
              ...(dragActive ? styles.fileUploadActive : {})
            }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <div style={styles.uploadIcon}>📄</div>
            <p style={styles.uploadText}>
              {files.length > 0 
                ? `Selected: ${files[0].name}`
                : 'Drag & drop your PDF file here or click to browse'
              }
            </p>
            <p style={styles.uploadSubtext}>
              Supports PDF files up to 10MB
            </p>
            <input
              type="file"
              id="file-input"
              style={styles.fileInput}
              onChange={handleFileChange}
              accept=".pdf"
            />
          </div>

          <div style={styles.settingsContainer}>
            <h3 style={styles.settingsTitle}>Summary Settings</h3>
            
            <div style={styles.settingsRow}>
              <label style={styles.settingsLabel}>
                Summary Length: {Math.round(summaryRatio * 100)}% of original
              </label>
              <div style={styles.rangeContainer}>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.05"
                  value={summaryRatio}
                  onChange={(e) => setSummaryRatio(parseFloat(e.target.value))}
                  style={styles.range}
                />
                <span style={styles.rangeValue}>{Math.round(summaryRatio * 100)}%</span>
              </div>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <Button
              type="submit"
              disabled={isProcessing || files.length === 0}
              isLoading={isProcessing}
              loadingText="Summarizing..."
            >
              Summarize PDF
            </Button>
          </div>
        </form>

        {summary && (
          <div style={styles.summaryContainer}>
            <h3 style={styles.summaryTitle}>Summary</h3>
            <div style={styles.summaryText}>
              {summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}