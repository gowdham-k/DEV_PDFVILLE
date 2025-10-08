import { useState, useCallback } from 'react';

/**
 * Reusable file upload area component with drag and drop functionality
 * @param {Object} props Component props
 * @param {Array} props.files Current files array
 * @param {Function} props.setFiles Function to update files
 * @param {String} props.acceptTypes File types to accept (e.g., ".pdf")
 * @param {String} props.uploadText Text to display in upload area
 * @param {String} props.uploadSubtext Subtext to display in upload area
 * @param {Function} props.onRemoveFile Function to remove a file
 * @param {Function} props.onRemoveAllFiles Function to remove all files
 */
const FileUploadArea = ({
  files = [],
  setFiles,
  acceptTypes = ".pdf",
  uploadText = "Drop files here or click to browse",
  uploadSubtext = "Select files to upload",
  onRemoveFile,
  onRemoveAllFiles
}) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback((e) => {
    if (e.target.files?.length) {
      setFiles(Array.from(e.target.files));
    }
  }, [setFiles]);

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
    
    if (e.dataTransfer.files?.length) {
      // Filter files if acceptTypes is provided
      const fileExtensions = acceptTypes.split(',').map(type => 
        type.trim().toLowerCase().replace('*', '')
      );
      
      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => {
        if (!acceptTypes || acceptTypes === '*') return true;
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();
        return fileExtensions.some(ext => fileExt === ext || ext === '');
      });
      
      if (droppedFiles.length > 0) {
        setFiles(prev => [...prev, ...droppedFiles]);
      }
    }
  }, [acceptTypes, setFiles]);

  // Default handlers if not provided
  const defaultRemoveFile = useCallback((index) => {
    setFiles(files => files.filter((_, i) => i !== index));
  }, [setFiles]);

  const defaultRemoveAllFiles = useCallback(() => {
    setFiles([]);
  }, [setFiles]);

  // Use provided handlers or defaults
  const removeFileFn = onRemoveFile || defaultRemoveFile;
  const removeAllFilesFn = onRemoveAllFiles || defaultRemoveAllFiles;

  const styles = {
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
    }
  };

  return (
    <>
      <style jsx>{`
        .file-item:hover { 
          border-color: #666666; 
          box-shadow: 0 4px 12px rgba(102, 102, 102, 0.2); 
        }
        button:hover:not(:disabled) { 
          transform: translateY(-2px); 
        }
      `}</style>

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
          accept={acceptTypes}
          onChange={handleFileChange}
          style={styles.fileInput}
        />
        
        <div style={styles.uploadIcon}>
          {files.length > 0 ? '📄' : '📁'}
        </div>
        
        <p style={styles.uploadText}>
          {files.length > 0 ? `${files.length} files selected` : uploadText}
        </p>
        <p style={styles.uploadSubtext}>
          {uploadSubtext}
        </p>
      </div>

      {files.length > 0 && (
        <div style={styles.filesList}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <button onClick={removeAllFilesFn} style={styles.removeAllButton}>
              🗑️ Remove All Files
            </button>
          </div>
          
          {files.map((file, index) => (
            <div key={file.name + index} className="file-item" style={styles.fileItem}>
              <span style={styles.fileIcon}>📄</span>
              <span style={styles.fileName}>
                {index + 1}. {file.name}
              </span>
              <button
                onClick={() => removeFileFn(index)}
                style={styles.removeButton}
                title="Remove file"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default FileUploadArea;