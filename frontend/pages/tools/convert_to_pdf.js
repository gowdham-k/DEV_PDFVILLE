"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { API_BASE_URL } from "../../components/config";
import { useRouter } from "next/navigation";
import UpgradeModal from "../../components/UpgradeModal";

export default function ConvertToPDFPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State declarations
  const [inputFormat, setInputFormat] = useState("");
  const [files, setFiles] = useState([]);
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
      setInputFormat(formatParam);
      setFormatFromUrl(true);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle user selection of a different format
  const handleFormatSelect = (format) => {
    setInputFormat(format);
    setFormatFromUrl(false); // User has manually selected a format
    setFiles([]); // Clear files when changing format
  };

  const conversionOptions = [
    {
      value: 'jpg',
      label: 'JPG to PDF',
      description: 'Convert JPG images into a single PDF document',
      icon: '🖼️',
      color: '#fff3e0',
      borderColor: '#ff9800',
      output: 'Single PDF file',
      allowMultiple: true
    },
    {
      value: 'png',
      label: 'PNG to PDF',
      description: 'Convert PNG images into a single PDF document',
      icon: '🎨',
      color: '#f3e5f5',
      borderColor: '#9c27b0',
      output: 'Single PDF file',
      allowMultiple: true
    },
    {
      value: 'word',
      label: 'Word to PDF',
      description: 'Convert Word documents (.doc, .docx) to PDF format',
      icon: '📝',
      color: '#e3f2fd',
      borderColor: '#2196f3',
      output: 'PDF document',
      allowMultiple: false
    },
    {
      value: 'excel',
      label: 'Excel to PDF',
      description: 'Convert Excel spreadsheets (.xls, .xlsx) to PDF format',
      icon: '📈',
      color: '#e8f5e8',
      borderColor: '#4caf50',
      output: 'PDF document',
      allowMultiple: false
    },
    {
      value: 'pptx',
      label: 'PowerPoint to PDF',
      description: 'Convert PowerPoint presentations (.ppt, .pptx) to PDF',
      icon: '📊',
      color: '#fce4ec',
      borderColor: '#e91e63',
      output: 'PDF document',
      allowMultiple: false
    },
    {
      value: 'html',
      label: 'HTML to PDF',
      description: 'Convert HTML files into PDF documents',
      icon: '🌐',
      color: '#fff8e1',
      borderColor: '#ffc107',
      output: 'PDF document',
      allowMultiple: false
    }
  ];

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
      background: files.length > 0 ? '#f8f8f8' : '#f0f0f0'
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
    filesDisplay: {
      marginTop: '20px'
    },
    fileItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px',
      background: '#f8f8f8',
      border: '2px solid #e8e8e8',
      borderRadius: '12px',
      marginBottom: '12px'
    },
    fileIcon: {
      marginRight: '16px',
      fontSize: '24px'
    },
    fileInfo: {
      flex: 1
    },
    fileName: {
      fontSize: '16px',
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
      padding: '6px 12px',
      fontSize: '12px',
      cursor: 'pointer',
      fontWeight: '600',
      marginLeft: '8px'
    },
    clearAllButton: {
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600',
      marginTop: '16px'
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
      background: (files.length > 0 && inputFormat) ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: (files.length > 0 && inputFormat) ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
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

  // Get accepted file types based on selected format
  const getAcceptedFileTypes = (format) => {
    switch(format) {
      case 'jpg': return 'image/jpeg,image/jpg,.jpg,.jpeg';
      case 'png': return 'image/png,.png';
      case 'word': return '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'excel': return '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'pptx': return '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
      case 'html': return '.html,.htm,text/html';
      default: return '';
    }
  };

  // Validate file type based on format
  const isValidFileType = (file, format) => {
    switch(format) {
      case 'jpg':
        return file.type.startsWith('image/jpeg') || file.type.includes('jpg');
      case 'png':
        return file.type.startsWith('image/png');
      case 'word':
        return file.type.includes('word') || file.name.endsWith('.doc') || file.name.endsWith('.docx');
      case 'excel':
        return file.type.includes('sheet') || file.type.includes('excel') || 
               file.name.endsWith('.xls') || file.name.endsWith('.xlsx');
      case 'pptx':
        return file.type.includes('presentation') || file.type.includes('powerpoint') ||
               file.name.endsWith('.ppt') || file.name.endsWith('.pptx');
      case 'html':
        return file.type.includes('html') || file.name.endsWith('.html') || file.name.endsWith('.htm');
      default:
        return false;
    }
  };

  const handleFileChange = (e) => {
    if (!inputFormat) {
      alert("Please select an input format first");
      return;
    }
    
    const selectedFiles = Array.from(e.target.files).filter(file => 
      isValidFileType(file, inputFormat)
    );
    
    if (selectedFiles.length !== e.target.files.length) {
      alert(`Some files were rejected. Please select only ${inputFormat.toUpperCase()} files.`);
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
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
    
    if (!inputFormat) {
      alert("Please select an input format first");
      return;
    }
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
      isValidFileType(file, inputFormat)
    );
    
    if (droppedFiles.length !== e.dataTransfer.files.length) {
      alert(`Some files were rejected. Please drop only ${inputFormat.toUpperCase()} files.`);
    }
    
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      alert("Please select files to convert");
      return;
    }

    if (!inputFormat) {
      alert("Please select an input format");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      
      if (['jpg', 'png'].includes(inputFormat)) {
        // For images, send multiple files
        files.forEach((file, index) => {
          formData.append('files[]', file);
        });
      } else {
        // For documents, typically send single file
        formData.append('file', files[0]);
      }
      
      formData.append("input_format", inputFormat);

      const response = await fetch(`${API_BASE_URL}/api/convert-${inputFormat}-to-pdf`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Check if it's a restriction error (403)
        if (response.status === 403) {
          const errorData = await response.json();
          if (errorData.show_upgrade) {
            setUpgradeMessage(errorData.message || "Upgrade to Premium to convert PDFs with more pages");
            setShowUpgradeModal(true);
            setIsProcessing(false);
            return;
          }
        }
        // Check if it's a file size error (413)
        if (response.status === 413) {
          setUpgradeMessage("File size exceeds the limit. Upgrade to Premium for larger file conversions.");
          setShowUpgradeModal(true);
          setIsProcessing(false);
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted.pdf`;
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

  const selectedFormat = conversionOptions.find(opt => opt.value === inputFormat);

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
          ← Back to Home
        </button>

        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span>📄</span>
          </div>
          <h1 style={styles.title}>Convert to PDF</h1>
          <p style={styles.subtitle}>
            Convert various file formats to PDF (JPG, PNG, Word, Excel, PowerPoint, HTML)
            {inputFormat && ` - ${inputFormat.toUpperCase()} selected`}
          </p>
        </div>

        <div style={styles.card}>
  {/* 🔼 Move File Selection ABOVE */}
  <div style={styles.section}>
    <div style={styles.instructions}>
      <h3 style={styles.instructionTitle}>📋 How to Convert to PDF:</h3>
      <ul style={styles.instructionList}>
        <li>First, select the input format you want to convert from</li>
        <li>Upload your files using the file selector or drag & drop</li>
        <li>JPG/PNG: You can upload multiple images to create one PDF</li>
        <li>Word/Excel/PowerPoint: Upload one document to convert</li>
        <li>HTML: Upload HTML files to convert to PDF</li>
        <li>Click "Convert to PDF" to start the conversion process</li>
      </ul>
    </div>

    <h2 style={styles.sectionTitle}>
      <span style={{ fontSize: '28px', marginRight: '12px' }}>📁</span>
      Select Files
      {inputFormat && (
        <span style={{ fontSize: '16px', fontWeight: 'normal', color: '#666', marginLeft: '10px' }}>
          ({selectedFormat?.allowMultiple ? 'Multiple files allowed' : 'Single file only'})
        </span>
      )}
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
        accept={getAcceptedFileTypes(inputFormat)}
        multiple={selectedFormat?.allowMultiple}
        onChange={handleFileChange}
        style={styles.fileInput}
        disabled={!inputFormat}
      />
      
      <div style={styles.uploadIcon}>
        {files.length > 0 ? selectedFormat?.icon || '📄' : '📁'}
      </div>
      
      <p style={styles.uploadText}>
        {!inputFormat 
          ? 'Please select an input format first'
          : files.length > 0 
            ? `${files.length} file${files.length > 1 ? 's' : ''} selected`
            : `Drop ${inputFormat.toUpperCase()} files here or click to browse`
        }
      </p>
      <p style={styles.uploadSubtext}>
        {inputFormat && `Select ${selectedFormat?.allowMultiple ? 'one or more' : 'one'} ${inputFormat.toUpperCase()} file${selectedFormat?.allowMultiple ? 's' : ''}`}
      </p>
    </div>

    {files.length > 0 && (
      <div style={styles.filesDisplay}>
        {files.map((file, index) => (
          <div key={index} style={styles.fileItem}>
            <span style={styles.fileIcon}>{selectedFormat?.icon || '📄'}</span>
            <div style={styles.fileInfo}>
              <div style={styles.fileName}>{file.name}</div>
              <div style={styles.fileSize}>
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <button onClick={() => removeFile(index)} style={styles.removeButton}>
              Remove
            </button>
          </div>
        ))}
        
        {files.length > 1 && (
          <button onClick={clearAllFiles} style={styles.clearAllButton}>
            Clear All Files
          </button>
        )}
      </div>
    )}
  </div>

  {/* 🔽 Format Selection goes AFTER file upload */}
  <div style={styles.formatSection}>
    <h2 style={styles.formatTitle}>
      <span style={{ fontSize: '28px', marginRight: '12px' }}>⚙️</span>
      Choose Input Format
      {inputFormat && (
        <span style={{ 
          fontSize: '16px', 
          color: '#666', 
          fontWeight: 'normal',
          marginLeft: '10px'
        }}>
          (Current: {inputFormat.toUpperCase()})
        </span>
      )}
    </h2>

    <div style={styles.formatGrid}>
      {conversionOptions.map((option) => {
        const isSelected = inputFormat === option.value;
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

  {/* Upgrade Modal */}
  {showUpgradeModal && (
    <UpgradeModal
      isOpen={showUpgradeModal}
      onClose={() => setShowUpgradeModal(false)}
      message={upgradeMessage}
    />
  )}

  {/* ✅ Keep Convert button at bottom */}
  <div style={styles.actionSection}>
    <button
      onClick={handleSubmit}
      disabled={files.length === 0 || !inputFormat || isProcessing}
      style={styles.processButton}
    >
      {isProcessing ? (
        <>
          <div className="spinner" style={styles.spinner}></div>
          Converting to PDF...
        </>
      ) : (
        <>
          <span style={{ fontSize: '24px', marginRight: '12px' }}>📄</span>
          Convert to PDF
        </>
      )}
    </button>
  </div>
</div>
      </div>
    </div>
  );
}