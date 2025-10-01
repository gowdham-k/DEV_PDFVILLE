import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { PDFDocument } from 'pdf-lib';
import { API_BASE_URL } from "../components/config";
import Head from "next/head";

export default function EditPDFPage() {
  const router = useRouter();
  const canvasRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTool, setCurrentTool] = useState("text");
  const [operations, setOperations] = useState([]);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  
  // Load PDF.js library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js';
    script.async = true;
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js';
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  // Text tool settings
  const [textContent, setTextContent] = useState("Sample Text");
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState("#000000");
  
  // Shape tool settings
  const [shapeType, setShapeType] = useState("rectangle");
  const [shapeWidth, setShapeWidth] = useState(100);
  const [shapeHeight, setShapeHeight] = useState(50);
  const [shapeColor, setShapeColor] = useState("#000000");
  const [shapeFill, setShapeFill] = useState(false);
  
  // Page operations
  const [selectedPage, setSelectedPage] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(90);
  
  // Preview canvas settings
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);

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
      file => file.type === 'application/pdf'
    );
    if (selectedFiles.length > 0) {
      setFiles(selectedFiles);
      loadPdfPreview(selectedFiles[0]);
    }
  };

  const loadPdfPreview = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      // Get the first page for preview
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 });
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match the PDF page
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Render the PDF page to the canvas
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Update state with total pages
      setSelectedPage(0);
      setPdfLoaded(true);
    } catch (error) {
      console.error("Error loading PDF preview:", error);
      setErrorMessage("Error loading PDF preview. Please try again.");
      setPdfLoaded(false);
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
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const pdfFiles = droppedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length > 0) {
      setFiles(pdfFiles);
      loadPdfPreview(pdfFiles[0]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
    if (files.length <= 1) {
      // Clear canvas if no files left
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setPdfLoaded(false);
    }
  };

  const removeAllFiles = () => {
    setFiles([]);
    setOperations([]);
    setPdfLoaded(false);
    // Clear canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleCanvasClick = (e) => {
    if (!files.length) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newOperation = {
      id: Date.now(),
      type: currentTool === 'text' ? 'add_text' : currentTool === 'shape' ? 'add_shape' : 'page_operation',
      page: selectedPage,
      x: x,
      y: y
    };

    if (currentTool === 'text') {
      newOperation.text = textContent;
      newOperation.fontSize = fontSize;
      newOperation.color = textColor;
    } else if (currentTool === 'shape') {
      newOperation.shape = shapeType;
      newOperation.width = shapeWidth;
      newOperation.height = shapeHeight;
      newOperation.color = shapeColor;
      newOperation.fill = shapeFill;
    }

    setOperations([...operations, newOperation]);
  };

  const addPageOperation = (operationType) => {
    const newOperation = {
      id: Date.now(),
      type: operationType,
      page: selectedPage,
      x: 0,
      y: 0
    };

    if (operationType === 'rotate_page') {
      newOperation.angle = rotationAngle;
    }

    setOperations([...operations, newOperation]);
  };

  const removeOperation = (operationId) => {
    setOperations(operations.filter(op => op.id !== operationId));
  };

  const updateCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // If PDF is loaded, we don't need to draw the placeholder
    if (pdfLoaded) {
      // Just draw operations on top of the loaded PDF
      const ctx = canvas.getContext('2d');
      
      // Draw operations for current page
      operations.filter(op => op.page === selectedPage).forEach(op => {
        if (op.type === 'add_text') {
          ctx.fillStyle = op.color || '#000000';
          ctx.font = `${op.fontSize || 16}px Arial`;
          ctx.fillText(op.text || 'Text', op.x, op.y);
        } else if (op.type === 'add_shape') {
          ctx.strokeStyle = op.color || '#000000';
          ctx.fillStyle = op.fill ? op.color || '#000000' : 'transparent';
          
          if (op.shape === 'rectangle') {
            if (op.fill) {
              ctx.fillRect(op.x, op.y, op.width, op.height);
            }
            ctx.strokeRect(op.x, op.y, op.width, op.height);
          } else if (op.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(op.x + op.width/2, op.y + op.height/2, Math.min(op.width, op.height)/2, 0, 2 * Math.PI);
            if (op.fill) {
              ctx.fill();
            }
            ctx.stroke();
          }
        }
      });
      return;
    }

    // If no PDF is loaded, draw a placeholder
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw a placeholder PDF page background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#cccccc';
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Draw page number
    ctx.fillStyle = '#666666';
    ctx.font = '14px Arial';
    ctx.fillText(`Page ${selectedPage + 1}`, 10, 25);
    
    // Draw operations for current page
    operations.filter(op => op.page === selectedPage).forEach(op => {
      if (op.type === 'add_text') {
        ctx.fillStyle = op.color || '#000000';
        ctx.font = `${op.fontSize || 16}px Arial`;
        ctx.fillText(op.text || 'Text', op.x, op.y);
      } else if (op.type === 'add_shape') {
        ctx.strokeStyle = op.color || '#000000';
        ctx.fillStyle = op.fill ? op.color || '#000000' : 'transparent';
        
        if (op.shape === 'rectangle') {
          if (op.fill) {
            ctx.fillRect(op.x, op.y, op.width, op.height);
          }
          ctx.strokeRect(op.x, op.y, op.width, op.height);
        } else if (op.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(op.x + op.width/2, op.y + op.height/2, Math.min(op.width, op.height)/2, 0, 2 * Math.PI);
          if (op.fill) {
            ctx.fill();
          }
          ctx.stroke();
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (!files.length || !operations.length) return;

    setIsProcessing(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append('files', file);
      });
      formData.append('operations', JSON.stringify(operations));
      
      const response = await fetch(`${API_BASE_URL}/api/edit-pdf`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      
      console.log("Edit response status:", response.status);

      if (!response.ok) {
        console.error(`Edit request failed with status: ${response.status}`);
        throw new Error(`Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = files.length === 1 ? `edited_${files[0].name}` : "edited_pdfs.zip";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        setErrorMessage("Connection error: Unable to reach the server. Please check your internet connection and try again.");
      } else {
        setErrorMessage("Error: " + error.message);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    window.location.href = "/";
  };

  useEffect(() => {
    updateCanvas();
  }, [operations, selectedPage]);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px'
    },
    backButton: {
      background: '#666666',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 20px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'all 0.2s ease'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px'
    },
    headerIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      fontSize: '40px',
      background: '#f0f0f0'
    },
    title: {
      fontSize: '48px',
      fontWeight: '800',
      color: '#333333',
      margin: '0 0 12px 0'
    },
    subtitle: {
      fontSize: '20px',
      color: '#666666',
      margin: 0
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    section: {
      padding: '40px'
    },
    sectionTitle: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#333333',
      margin: '0 0 24px 0',
      display: 'flex',
      alignItems: 'center'
    },
    dropZone: {
      position: 'relative',
      border: '3px dashed #cccccc',
      borderRadius: '16px',
      padding: '60px 40px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      background: dragActive ? '#f8f8f8' : 'white',
      borderColor: dragActive ? '#666666' : '#cccccc'
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
      fontSize: '20px',
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
      padding: '16px',
      margin: '8px 0',
      background: 'white',
      border: '2px solid #f0f0f0',
      borderRadius: '12px',
      transition: 'all 0.2s ease'
    },
    fileIcon: {
      fontSize: '24px',
      marginRight: '16px'
    },
    fileName: {
      flex: 1,
      fontSize: '16px',
      fontWeight: '500',
      color: '#333333'
    },
    removeButton: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      border: 'none',
      background: '#ff4444',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    editorContainer: {
      display: 'grid',
      gridTemplateColumns: '300px 1fr 250px',
      gap: '24px',
      marginTop: '24px'
    },
    toolPanel: {
      background: '#f8f8f8',
      padding: '20px',
      borderRadius: '12px'
    },
    toolButton: {
      width: '100%',
      padding: '12px 16px',
      margin: '4px 0',
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'all 0.2s ease'
    },
    activeToolButton: {
      background: '#666666',
      color: 'white',
      borderColor: '#666666'
    },
    canvas: {
      border: '2px solid #e0e0e0',
      borderRadius: '8px',
      cursor: 'crosshair',
      background: 'white'
    },
    operationsList: {
      background: '#f8f8f8',
      padding: '20px',
      borderRadius: '12px',
      maxHeight: '500px',
      overflowY: 'auto'
    },
    settingGroup: {
      marginBottom: '16px'
    },
    settingLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      marginBottom: '8px',
      color: '#333333'
    },
    input: {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #e0e0e0',
      borderRadius: '6px',
      fontSize: '14px',
      color: '#333333'
    },
    colorInput: {
      width: '100%',
      height: '40px',
      border: '2px solid #f0f0f0',
      borderRadius: '6px',
      cursor: 'pointer',
      background: 'none'
    },
    select: {
      width: '100%',
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #e0e0e0',
      fontSize: '14px',
      color: '#333333',
      background: 'white',
      cursor: 'pointer'
    },
    rangeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    rangeInput: {
      flex: 1,
      height: '6px',
      borderRadius: '3px',
      background: '#f0f0f0',
      outline: 'none',
      cursor: 'pointer'
    },
    rangeValue: {
      minWidth: '40px',
      padding: '4px 8px',
      background: '#666666',
      color: 'white',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600',
      textAlign: 'center'
    },
    operationItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 12px',
      margin: '4px 0',
      background: 'white',
      borderRadius: '6px',
      border: '1px solid #f0f0f0',
      fontSize: '12px'
    },
    removeOpButton: {
      background: '#ff4444',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '12px',
      cursor: 'pointer'
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
      background: files.length > 0 && operations.length > 0 ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: files.length > 0 && operations.length > 0 ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
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
      <Head>
        <title>Edit PDF</title>
        <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.min.js"></script>
        <script>
          {`
            window.onload = function() {
              if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/build/pdf.worker.min.js';
              }
            }
          `}
        </script>
      </Head>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .spinner { animation: spin 1s linear infinite; }
        button:hover:not(:disabled) { transform: translateY(-2px); }
        .file-item:hover { border-color: #666666; box-shadow: 0 4px 12px rgba(102, 102, 102, 0.2); }
        .tool-button:hover { background: #f0f0f0; }
        .active-tool:hover { background: #555555; }
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
          \u2190 Back to Home
        </button>

        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span>\u270F</span>
          </div>
          <h1 style={styles.title}>Edit PDF</h1>
          <p style={styles.subtitle}>Add text, shapes, and modify your PDF documents</p>
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.instructions}>
              <h3 style={styles.instructionTitle}>
                \u270F How to Edit PDF:
              </h3>
              <ul style={styles.instructionList}>
                <li>Upload PDF files you want to edit</li>
                <li>Use the tools panel to select text, shapes, or page operations</li>
                <li>Click on the canvas preview to add elements</li>
                <li>Configure settings for each tool in the left panel</li>
                <li>Review your operations in the right panel</li>
                <li>Click "Process PDF" to apply all changes</li>
              </ul>
            </div>

            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>
                \uD83D\uDCC1
              </span>
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
                {files.length > 0 ? '\uD83D\uDCC4' : '\uD83D\uDCC1'}
              </div>
              
              <p style={styles.uploadText}>
                {files.length > 0 ? 'Files selected' : 'Drag & drop PDF files here'}
              </p>
              <p style={styles.uploadSubtext}>
                {files.length > 0 ? `${files.length} file${files.length !== 1 ? 's' : ''} ready` : 'or click to browse'}
              </p>
            </div>

            {files.length > 0 && (
              <div style={styles.filesList}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <button onClick={removeAllFiles} style={styles.removeAllButton}>
                    \uD83D\uDDD1 Remove All Files
                  </button>
                </div>
                
                {files.map((file, index) => (
                  <div key={file.name + index} className="file-item" style={styles.fileItem}>
                    <span style={styles.fileIcon}>\uD83D\uDCC4</span>
                    <span style={styles.fileName}>
                      {index + 1}. {file.name}
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      style={styles.removeButton}
                      title="Remove file"
                    >
                      \u00D7
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>
                <span style={{ fontSize: '28px', marginRight: '12px' }}>
                  \u270F
                </span>
                PDF Editor
              </h2>

              <div style={styles.editorContainer}>
                {/* Tools Panel */}
                <div style={styles.toolPanel}>
                  <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
                    \u2699 Tools
                  </h3>
                  
                  <button
                    className={`tool-button ${currentTool === 'text' ? 'active-tool' : ''}`}
                    style={{
                      ...styles.toolButton,
                      ...(currentTool === 'text' ? styles.activeToolButton : {})
                    }}
                    onClick={() => setCurrentTool('text')}
                  >
                    \uD83D\uDCDD Text Tool
                  </button>
                  
                  <button
                    className={`tool-button ${currentTool === 'shape' ? 'active-tool' : ''}`}
                    style={{
                      ...styles.toolButton,
                      ...(currentTool === 'shape' ? styles.activeToolButton : {})
                    }}
                    onClick={() => setCurrentTool('shape')}
                  >
                    \uD83D\uDD36 Shape Tool
                  </button>
                  
                  <button
                    className={`tool-button ${currentTool === 'page' ? 'active-tool' : ''}`}
                    style={{
                      ...styles.toolButton,
                      ...(currentTool === 'page' ? styles.activeToolButton : {})
                    }}
                    onClick={() => setCurrentTool('page')}
                  >
                    \uD83D\uDCC4 Page Operations
                  </button>

                  {/* Tool Settings */}
                  <div style={{ marginTop: '24px' }}>
                    <h4 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>\u2699 Settings</h4>
                    
                    {currentTool === 'text' && (
                      <>
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Text Content</label>
                          <input
                            type="text"
                            value={textContent}
                            onChange={(e) => setTextContent(e.target.value)}
                            style={styles.input}
                            placeholder="Enter text"
                          />
                        </div>
                        
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Font Size: {fontSize}px</label>
                          <div style={styles.rangeContainer}>
                            <input
                              type="range"
                              min="8"
                              max="72"
                              value={fontSize}
                              onChange={(e) => setFontSize(parseInt(e.target.value))}
                              style={styles.rangeInput}
                            />
                            <div style={styles.rangeValue}>{fontSize}px</div>
                          </div>
                        </div>
                        
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Text Color</label>
                          <input
                            type="color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            style={styles.colorInput}
                          />
                        </div>
                      </>
                    )}

                    {currentTool === 'shape' && (
                      <>
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Shape Type</label>
                          <select
                            value={shapeType}
                            onChange={(e) => setShapeType(e.target.value)}
                            style={styles.select}
                          >
                            <option value="rectangle">Rectangle</option>
                            <option value="circle">Circle</option>
                          </select>
                        </div>
                        
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Width: {shapeWidth}px</label>
                          <div style={styles.rangeContainer}>
                            <input
                              type="range"
                              min="20"
                              max="300"
                              value={shapeWidth}
                              onChange={(e) => setShapeWidth(parseInt(e.target.value))}
                              style={styles.rangeInput}
                            />
                            <div style={styles.rangeValue}>{shapeWidth}px</div>
                          </div>
                        </div>
                        
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Height: {shapeHeight}px</label>
                          <div style={styles.rangeContainer}>
                            <input
                              type="range"
                              min="20"
                              max="300"
                              value={shapeHeight}
                              onChange={(e) => setShapeHeight(parseInt(e.target.value))}
                              style={styles.rangeInput}
                            />
                            <div style={styles.rangeValue}>{shapeHeight}px</div>
                          </div>
                        </div>
                        
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Shape Color</label>
                          <input
                            type="color"
                            value={shapeColor}
                            onChange={(e) => setShapeColor(e.target.value)}
                            style={styles.colorInput}
                          />
                        </div>
                        
                        <div style={styles.settingGroup}>
                          <label style={{ ...styles.settingLabel, display: 'flex', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              checked={shapeFill}
                              onChange={(e) => setShapeFill(e.target.checked)}
                              style={{ marginRight: '8px' }}
                            />
                            Fill Shape
                          </label>
                        </div>
                      </>
                    )}

                    {currentTool === 'page' && (
                      <>
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Page Number</label>
                          <input
                            type="number"
                            value={selectedPage}
                            onChange={(e) => setSelectedPage(parseInt(e.target.value) || 0)}
                            min="0"
                            style={styles.input}
                          />
                        </div>
                        
                        <div style={styles.settingGroup}>
                          <label style={styles.settingLabel}>Rotation: {rotationAngle}°</label>
                          <select
                            value={rotationAngle}
                            onChange={(e) => setRotationAngle(parseInt(e.target.value))}
                            style={styles.select}
                          >
                            <option value={90}>90°</option>
                            <option value={180}>180°</option>
                            <option value={270}>270°</option>
                          </select>
                        </div>
                        
                        <button onClick={() => addPageOperation('rotate_page')} style={styles.toolButton}>
                          \u21BB Rotate Page
                        </button>
                        
                        <button onClick={() => addPageOperation('delete_page')} style={styles.toolButton}>
                          \uD83D\uDDD1 Delete Page
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Canvas Preview */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={styles.settingLabel}>Page: {selectedPage}</label>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                      <button
                        onClick={() => setSelectedPage(Math.max(0, selectedPage - 1))}
                        style={styles.toolButton}
                        disabled={selectedPage <= 0}
                      >
                        \u2190 Previous
                      </button>
                      <button
                        onClick={() => setSelectedPage(selectedPage + 1)}
                        style={styles.toolButton}
                      >
                        Next \u2192
                      </button>
                    </div>
                  </div>
                  
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={500}
                    style={styles.canvas}
                    onClick={handleCanvasClick}
                  />
                  
                  <p style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
                    Click on the canvas to add {currentTool === 'text' ? 'text' : currentTool === 'shape' ? 'shapes' : 'elements'}
                  </p>
                </div>

                {/* Operations List */}
                <div style={styles.operationsList}>
                  <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600' }}>
                    \uD83D\uDCC3 Operations
                  </h3>
                  
                  {operations.length === 0 ? (
                    <p style={{ color: '#666', fontSize: '14px', textAlign: 'center' }}>
                      No operations yet. Use the tools to add content.
                    </p>
                  ) : (
                    operations.map(op => (
                      <div key={op.id} style={styles.operationItem}>
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {op.type.replace('_', ' ').toUpperCase()}
                          </div>
                          <div style={{ color: '#666', fontSize: '11px' }}>
                            Page {op.page}  {op.x?.toFixed(0)},{op.y?.toFixed(0)}
                            {op.text && `  "${op.text}"`}
                            {op.shape && `  ${op.shape}`}
                          </div>
                        </div>
                        <button
                          onClick={() => removeOperation(op.id)}
                          style={styles.removeOpButton}
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                  
                  {operations.length > 0 && (
                    <button
                      onClick={() => setOperations([])}
                      style={{
                        ...styles.toolButton,
                        background: '#ff4444',
                        color: 'white',
                        marginTop: '16px'
                      }}
                    >
                      \uD83D\uDDD1 Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          <div style={styles.actionSection}>
            <button
              onClick={handleSubmit}
              disabled={files.length === 0 || operations.length === 0 || isProcessing}
              style={styles.processButton}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" style={styles.spinner}></div>
                  Processing PDF...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>
                    \u270F
                  </span>
                  Process {files.length} PDF{files.length !== 1 ? 's' : ''} ({operations.length} operations)
                </>
              )}
            </button>            
            {(files.length === 0 || operations.length === 0) && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                {files.length === 0 
                  ? 'Please select PDF files' 
                  : 'Please add at least one edit operation'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}