import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../components/config";
import { useUpgrade } from "../../context/UpgradeContext";
import HubspotTracking, { trackEvent } from "../../components/HubspotTracking";
import Head from "next/head";

export default function CompressPage() {  
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  
  // Use global upgrade context
  const { setUpgradeMessage } = useUpgrade();
  
  // Track page view and events with HubSpot
  useEffect(() => {
    // Track page view
    trackEvent('PDF Compression Tool Viewed');
  }, []);

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

  const [compressionStats, setCompressionStats] = useState(null);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a PDF file to compress");
      return;
    }

    // Track compression event in HubSpot
    trackEvent('PDF Compression Started', {
      compressionLevel: compressionLevel,
      fileSize: file.size,
      fileName: file.name
    });

    setIsProcessing(true);
    setCompressionStats(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("compression_level", compressionLevel);
      formData.append("return_stats", "true");

      // Make sure we're using the correct API endpoint that matches the backend
      const response = await fetch(`${API_BASE_URL}/api/compress`, {
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
            setUpgradeMessage(errorData.error);
            setShowUpgradeModal(true);
            return;
          }
          
          // Otherwise throw a generic error
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } else {
          throw new Error(`Server error: ${response.status}`);
        }
      }

      // Check if the response is JSON (stats) or blob (file)
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const stats = await response.json();
        setCompressionStats(stats);
        
        // Download the file in a separate request
        const fileFormData = new FormData();
        fileFormData.append("file", file);
        fileFormData.append("compression_level", compressionLevel);
        
        const fileResponse = await fetch(`${API_BASE_URL}/api/compress`, {
          method: "POST",
          body: fileFormData,
        });
        
        if (!fileResponse.ok) {
          throw new Error(`Server error: ${fileResponse.status}`);
        }
        
        const blob = await fileResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "compressed.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Track successful compression in HubSpot
        trackEvent('PDF Compression Completed', {
          compressionLevel: compressionLevel,
          originalSize: file.size,
          compressedSize: blob.size,
          reductionPercentage: ((file.size - blob.size) / file.size * 100).toFixed(2)
        });
      } else {
        // Handle as before for backward compatibility
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "compressed.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error:', error);
      
      // Show upgrade modal for free users instead of generic error
      setUpgradeMessage("Upgrade to premium to compress PDF files of any size with advanced compression options.");
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

  const compressionOptions = [
    {
      value: 'lossless',
      label: 'Lossless Compression',
      description: 'Slight reduction in file size, maintains high quality',
      reduction: '10-30%',
      color: '#f5f5f5',
      borderColor: '#666666'
    },
    {
      value: 'medium',
      label: 'Medium Compression',
      description: 'Balanced compression with good quality retention',
      reduction: '30-50%',
      color: '#e8e8e8',
      borderColor: '#333333'
    },
    {
      value: 'high',
      label: 'High Compression',
      description: 'Maximum compression, some quality loss may occur',
      reduction: '50-70%',
      color: '#d0d0d0',
      borderColor: '#000000'
    }
  ];

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
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
      borderBottom: '1px solid #f0f0f0'
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
      background: dragActive ? '#f0f0f0' : '#fafafa'
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
      background: file ? '#f0f0f0' : '#f0f0f0'
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
      background: '#f0f0f0',
      border: '2px solid #d0d0d0',
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
    compressionSection: {
      padding: '32px',
      borderBottom: '1px solid #f0f0f0'
    },
    compressionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    compressionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    compressionOption: {
      padding: '24px',
      border: '3px solid',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    },
    compressionIcon: {
      fontSize: '32px',
      marginBottom: '12px',
      display: 'block'
    },
    compressionLabel: {
      fontSize: '18px',
      fontWeight: '700',
      marginBottom: '8px'
    },
    compressionDesc: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '12px',
      lineHeight: '1.4'
    },
    compressionReduction: {
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
      background: '#f0f0f0',
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
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50">
          <UpgradeModal 
            message={upgradeMessage} 
            onClose={closeUpgradeModal} 
          />
        </div>
      )}
      
      <Head>    
  <title>Compress PDF – PDFVille</title>
  <meta name="description" content="Compress PDF files online for free. Reduce PDF file size while maintaining quality with our easy-to-use PDF compression tool." />

  <HubspotTracking 
    pageName="PDF Compression Tool" 
    pageData={{ 
      toolType: "compression",
      toolCategory: "pdf_optimization" 
    }} 
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://dev.pdfville.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Compress PDF",
            item: "https://dev.pdfville.com/compress_pdf",
          },
        ],
      }),
    }}
  />

  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Brand",
            name: "PDFVille",
            url: "https://dev.pdfville.com",      
            logo: "https://dev.pdfville.com/logo.png",
          },
        ],
      }),
    }}
  />
        {/* Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "PDF Compressor",
              description: "Online tool to compress PDF files.",
              brand: "PDFVille",
              url: "https://dev.pdfville.com/compress_pdf",
            }),
          }}
        />
{/* FAQPage */}
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Can you compress a PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. Upload your PDF to PDFVille’s Compress tool, choose the desired compression level, and download a smaller, high-quality file."
          }
        },
        {
          "@type": "Question",
          name: "Can you compress a PDF file size?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Absolutely. Our compressor reduces file size while keeping text and images clear, ideal for emailing or sharing online."
          }
        },
        {
          "@type": "Question",
          name: "How do I reduce the size of a PDF without losing quality?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Use PDFVille’s “Compress PDF” feature. It optimizes images and fonts to shrink the file with minimal quality loss."
          }
        },
        {
          "@type": "Question",
          name: "Can Adobe compress a PDF?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes, Adobe Acrobat has a “Reduce File Size” option, but PDFVille offers a free, browser-based alternative with no installation."
          }
        },
        {
          "@type": "Question",
          name: "Is PDF compression safe?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. Files are processed securely, and we automatically delete them from our servers after a short period."
          }
        },
        {
          "@type": "Question",
          name: "Will compressing a PDF change its content?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "No. The text and layout stay the same; only the file size and image resolution may be optimized."
          }
        },
        {
          "@type": "Question",
          name: "What is the maximum file size I can upload for compression?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "PDFVille supports uploads up to 200 MB per file."
          }
        },
        {
          "@type": "Question",
          name: "Do I need to create an account to compress PDFs?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "No account is required—just upload, compress, and download instantly."
          }
        },
        {
          "@type": "Question",
          name: "Can I compress multiple PDFs at once?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. Our batch-compress option lets you upload several PDFs and get all the compressed files in one download."
          }
        },
        {
          "@type": "Question",
          name: "Does PDF compression work on mobile devices?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. PDFVille’s web app works in any mobile browser on Android or iOS."
          }
        }
      ]
    }),
  }}
/>


</Head>
      {/* rest of your page content */}
    
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
            <span>\uD83D\uDCE6</span>
          </div>
          <h1 style={styles.title}>Compress PDF</h1>
          <p style={styles.subtitle}>Reduce PDF file size while maintaining quality</p>
        </div>

        <div style={styles.card}>
          {compressionStats && (
            <div style={{
              padding: '20px',
              margin: '0 32px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '1px solid #e9ecef',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '12px'
              }}>Compression Results</h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div>
                  <p style={{margin: '4px 0', color: '#666'}}>Original Size:</p>
                  <p style={{margin: '4px 0', fontWeight: '600'}}>{compressionStats.original_size}</p>
                </div>
                <div>
                  <p style={{margin: '4px 0', color: '#666'}}>Compressed Size:</p>
                  <p style={{margin: '4px 0', fontWeight: '600'}}>{compressionStats.compressed_size}</p>
                </div>
                <div>
                  <p style={{margin: '4px 0', color: '#666'}}>Compression Ratio:</p>
                  <p style={{margin: '4px 0', fontWeight: '600'}}>{compressionStats.compression_ratio}%</p>
                </div>
                <div>
                  <p style={{margin: '4px 0', color: '#666'}}>Processing Time:</p>
                  <p style={{margin: '4px 0', fontWeight: '600'}}>{compressionStats.processing_time} seconds</p>
                </div>
              </div>
              
              <div style={{
                marginTop: '15px',
                height: '10px',
                backgroundColor: '#e9ecef',
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${100 - compressionStats.compression_ratio}%`,
                  height: '100%',
                  backgroundColor: '#28a745',
                  borderRadius: '5px'
                }}></div>
              </div>
            </div>
          )}
          
          <div style={styles.section}>
            <div style={styles.instructions}>
              <h3 style={styles.instructionTitle}>\uD83D\uDCE6 How to Compress PDFs:</h3>
              <ul style={styles.instructionList}>
                <li>Select a PDF file that you want to compress</li>
                <li>Choose your preferred compression level based on your needs</li>
                <li>Lossless compression: Better quality, smaller file size reduction</li>
                <li>High compression: Maximum file size reduction, some quality loss</li>
                <li>Click "Compress PDF" to process and download the optimized file</li>
              </ul>
            </div>

            <h2 style={styles.sectionTitle}>
              <span style={{ fontSize: '28px', marginRight: '12px' }}>\uD83D\uDCC1</span>
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
                {file ? '\uD83D\uDCC4' : '\uD83D\uDCC1'}
              </div>
              
              <p style={styles.uploadText}>
                {file ? 'PDF file selected' : 'Drop PDF file here or click to browse'}
              </p>
              <p style={styles.uploadSubtext}>
                Select one PDF file to compress
              </p>
            </div>

            {file && (
              <div style={styles.fileDisplay}>
                <span style={styles.fileIcon}>\uD83D\uDCC4</span>
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
            <div style={styles.compressionSection}>
              <h2 style={styles.compressionTitle}>
                <span style={{ fontSize: '28px', marginRight: '12px' }}>
  {'\u2699\uFE0F'}
</span>

                Compression Level
              </h2>

              <div style={styles.compressionGrid}>
                {compressionOptions.map((option) => {
                  const isSelected = compressionLevel === option.value;
                  return (
                    <div
                      key={option.value}
                      onClick={() => setCompressionLevel(option.value)}
                      style={{
                        ...styles.compressionOption,
                        borderColor: isSelected ? option.borderColor : '#e0e0e0',
                        background: isSelected ? option.color : 'white',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: isSelected ? `0 8px 25px ${option.borderColor}40` : '0 2px 8px rgba(0,0,0,0.1)'
                      }}
                    >
                      <span style={styles.compressionIcon}>
                        {option.value === 'lossless' ? '\u26AA' : option.value === 'medium' ? '\u26AB' : '\u25CF'}
                      </span>
                      <div style={{
                        ...styles.compressionLabel,
                        color: isSelected ? option.borderColor : '#333'
                      }}>
                        {option.label}
                      </div>
                      <div style={styles.compressionDesc}>
                        {option.description}
                      </div>
                      <span style={{
                        ...styles.compressionReduction,
                        background: option.borderColor
                      }}>
                        Size reduction: {option.reduction}
                      </span>
                    </div>
                  );
                })}
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
                  Compressing PDF...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>\uD83D\uDCE6</span>
                  Compress PDF
                </>
              )}
            </button>
            
            {!file && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                Please select a PDF file to compress
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
    
    {/* Upgrade Modal is now handled by the global context */}
    </>
  );
}

// No need to define UpgradeModalRenderer here as it's already imported from UpgradeModal.js