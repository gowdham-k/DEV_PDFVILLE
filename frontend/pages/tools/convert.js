"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "../../components/config";
import { useRouter } from "next/navigation";

export default function ConvertPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State declarations
  const [outputFormat, setOutputFormat] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formatFromUrl, setFormatFromUrl] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState("");

  // Handle format parameter from URL only once on initial load
  useEffect(() => {
    const formatParam = searchParams.get("format");
    console.log("Format from URL:", formatParam);
    
    if (formatParam && conversionOptions.some(opt => opt.value === formatParam)) {
      setOutputFormat(formatParam);
      setFormatFromUrl(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle user selection of a different format
  const handleFormatSelect = (format) => {
    setOutputFormat(format);
    setFormatFromUrl(false); // User has manually selected a format
  };

  // Define your styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)',
      padding: '0px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    maxWidth: {
      maxWidth: '1200px',
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
      borderBottom: '1px solid #f8f8f8'
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
      background: dragActive ? '#f8f8f8' : '#fafafa'
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
      background: file ? '#f8f8f8' : '#f0f0f0'
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
      background: '#f8f8f8',
      border: '2px solid #e8e8e8',
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
    formatSection: {
      padding: '32px',
      borderBottom: '1px solid #f8f8f8'
    },
    formatTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    formatGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    formatOption: {
      padding: '24px',
      border: '3px solid',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'left',
      position: 'relative'
    },
    formatIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      display: 'block'
    },
    formatLabel: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    formatDesc: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '12px',
      lineHeight: '1.4'
    },
    formatOutput: {
      display: 'inline-block',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      color: 'white'
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
    urlIndicator: {
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: '#666',
      color: 'white',
      fontSize: '10px',
      padding: '2px 6px',
      borderRadius: '10px'
    }
  };

  // Rest of your component functions
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

  const closeUpgradeModal = () => {
    setShowUpgradeModal(false);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a PDF file to convert");
      return;
    }

    if (!outputFormat) {
      alert("Please select an output format");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("output_format", outputFormat);
      
      // Get user email from localStorage
      const userEmail = localStorage.getItem('userEmail') || 'guest@example.com';
      formData.append("user_email", userEmail);

      const response = await fetch(`${API_BASE_URL}/api/convert-${outputFormat}`, {
        method: "POST",
        body: formData,
      });

      if (response.status === 403) {
        // Handle restriction error - show upgrade modal
        const errorData = await response.json();
        if (errorData.show_upgrade) {
          setUpgradeMessage(errorData.message || "You've reached the limit for free PDF conversions. Upgrade to Premium for unlimited conversions.");
          setShowUpgradeModal(true);
          return;
        }
      }

      // Check if it's a file size error (413)
      if (response.status === 413) {
        setUpgradeMessage("File size exceeds the limit. Upgrade to Premium for larger file conversions.");
        setShowUpgradeModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      
      const extensions = {
        'jpg': 'jpg',
        'png': 'png',
        'pptx': 'pptx',
        'excel': 'xlsx',
        'html': 'html',
        'word': 'docx'
      };
      
      const isArchive = ['jpg', 'png'].includes(outputFormat);
      a.download = isArchive ? `converted.zip` : `converted.${extensions[outputFormat]}`;
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
    router.push("/");
  };

  const conversionOptions = [
    {
      value: 'jpg',
      label: 'Convert to JPG',
      description: 'High-quality images, perfect for sharing and viewing',
      icon: '???',
      color: '#f5f5f5',
      borderColor: '#666666',
      output: 'ZIP file with JPG images'
    },
    {
      value: 'png',
      label: 'Convert to PNG',
      description: 'Lossless images with transparency support',
      icon: '??',
      color: '#f0f0f0',
      borderColor: '#555555',
      output: 'ZIP file with PNG images'
    },
    {
      value: 'pptx',
      label: 'Convert to PowerPoint',
      description: 'Editable presentation slides from your PDF',
      icon: '??',
      color: '#e8e8e8',
      borderColor: '#444444',
      output: 'PowerPoint file (.pptx)'
    },
    {
      value: 'excel',
      label: 'Convert to Excel',
      description: 'Extract tables and data into spreadsheet format',
      icon: '??',
      color: '#e0e0e0',
      borderColor: '#333333',
      output: 'Excel file (.xlsx)'
    },
    {
      value: 'html',
      label: 'Convert to HTML',
      description: 'Web-ready HTML files with text and images',
      icon: '??',
      color: '#d8d8d8',
      borderColor: '#000000',
      output: 'ZIP file with HTML files'
    },
    {
      value: 'word',
      label: 'Convert to Word',
      description: 'Editable Word document (.docx) for easy text editing',
      icon: '??',
      color: '#d0d0d0',
      borderColor: '#222222',
      output: 'Word Document (.docx)'
    }
  ];

  const selectedFormat = conversionOptions.find(opt => opt.value === outputFormat);

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner { animation: spin 1s linear infinite; }
        button:hover:not(:disabled) { transform: translateY(-2px); }
      `}</style>

      <div style={styles.maxWidth}>
        <button onClick={goBack} style={styles.backButton}>
          ? Back to Home
        </button>

        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span>??</span>
          </div>
          <h1 style={styles.title}>Convert PDF</h1>
          <p style={styles.subtitle}>
            Convert PDF to various formats (JPG, PNG, PPTX, Excel, HTML, Word)
            {outputFormat && ` - ${outputFormat.toUpperCase()} selected`}
          </p>
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.instructions}>
              <h3 style={styles.instructionTitle}>?? How to Convert PDFs:</h3>
              <ul style={styles.instructionList}>
                <li>Select a PDF file that you want to convert</li>
                <li>Choose your desired output format from the options below</li>
                <li>JPG/PNG: Each page becomes a separate image file</li>
                <li>PowerPoint: PDF pages become editable slides</li>
                <li>Excel: Extract tables and data into spreadsheet format</li>
                <li>HTML: Create web-ready files with text and images</li>
                <li>Word: Convert to editable Word document for text editing</li>
              </ul>
            </div>

            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>??</span>
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
                {file ? '??' : '??'}
              </div>
              
              <p style={styles.uploadText}>
                {file ? 'PDF file selected' : 'Drop PDF file here or click to browse'}
              </p>
              <p style={styles.uploadSubtext}>
                Select one PDF file to convert
              </p>
            </div>

            {file && (
              <div style={styles.fileDisplay}>
                <span style={styles.fileIcon}>??</span>
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

          <div style={styles.formatSection}>
            <h2 style={styles.formatTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>??</span>
              Choose Output Format
              {outputFormat && (
                <span style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  fontWeight: 'normal',
                  marginLeft: '10px'
                }}>
                  (Current: {outputFormat.toUpperCase()})
                </span>
              )}
            </h2>

            <div style={styles.formatGrid}>
              {conversionOptions.map((option) => {
                const isSelected = outputFormat === option.value;
                const isFromUrl = isSelected && formatFromUrl;
                
                return (
                  <div
                    key={option.value}
                    onClick={() => handleFormatSelect(option.value)}
                    style={{
                      ...styles.formatOption,
                      borderColor: isSelected ? option.borderColor : '#e0e0e0',
                      background: isSelected ? option.color : 'white',
                      transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isSelected ? `0 8px 25px ${option.borderColor}40` : '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    {isFromUrl && (
                      <div style={styles.urlIndicator}>
                        From URL
                      </div>
                    )}
                    <span style={styles.formatIcon}>{option.icon}</span>
                    <div style={{
                      ...styles.formatLabel,
                      color: isSelected ? option.borderColor : '#333'
                    }}>
                      {option.label}
                    </div>
                    <div style={styles.formatDesc}>
                      {option.description}
                    </div>
                    <span style={{
                      ...styles.formatOutput,
                      background: option.borderColor
                    }}>
                      Output: {option.output}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.actionSection}>
            <button
              onClick={handleSubmit}
              disabled={!file || !outputFormat || isProcessing}
              style={styles.processButton}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" style={styles.spinner}></div>
                  Converting to {selectedFormat?.label.split(' ')[2] || outputFormat}...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>??</span>
                  Convert to {selectedFormat?.label.split(' ')[2] || outputFormat.toUpperCase()}
                </>
              )}
            </button>
            
            {!file && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                Please select a PDF file to convert
              </p>
            )}
            {file && !outputFormat && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                Please select an output format
              </p>
            )}
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
    </div>
  );
}