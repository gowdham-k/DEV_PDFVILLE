

import { useState } from "react";
import { API_BASE_URL } from "../../components/config";
import { useUpgrade } from "../../context/UpgradeContext";

export default function SecurePage() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [securityOptions, setSecurityOptions] = useState({
    password: '',
    confirmPassword: '',
    permissions: {
      print: true,
      copy: true,
      modify: false,
      annotate: true
    }
  });
  const [passwordStrength, setPasswordStrength] = useState('');

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

  const checkPasswordStrength = (password) => {
    if (password.length < 4) return 'weak';
    if (password.length < 8) return 'medium';
    if (password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'strong';
    return 'medium';
  };

  const handlePasswordChange = (password) => {
    setSecurityOptions({...securityOptions, password});
    setPasswordStrength(checkPasswordStrength(password));
  };

  // Premium modal state from global context
  const { showUpgradeModal, setUpgradeMessage } = useUpgrade();

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a PDF file to secure");
      return;
    }

    if (!securityOptions.password) {
      alert("Please enter a password to protect your PDF");
      return;
    }

    if (securityOptions.password !== securityOptions.confirmPassword) {
      alert("Passwords do not match. Please confirm your password.");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", securityOptions.password);
      formData.append("allow_print", securityOptions.permissions.print);
      formData.append("allow_copy", securityOptions.permissions.copy);
      formData.append("allow_modify", securityOptions.permissions.modify);
      formData.append("allow_annotate", securityOptions.permissions.annotate);

      const response = await fetch(`${API_BASE_URL}/api/protect`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Check for premium restriction
        if (response.status === 403 && errorData.show_upgrade) {
          setUpgradeMessage(errorData.error || "This feature requires a premium subscription.");
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
      a.download = "protected.pdf";
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
    window.location.href = "/";
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 'weak': return '#999999';
      case 'medium': return '#666666';
      case 'strong': return '#333333';
      default: return '#ccc';
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f8f8 0%, #e8e8e8 100%)',
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
    securitySection: {
      padding: '32px',
      borderBottom: '1px solid #f8f8f8'
    },
    securityTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center'
    },
    passwordGroup: {
      marginBottom: '24px'
    },
    passwordLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '8px',
      display: 'block'
    },
    passwordInput: {
      width: '100%',
      padding: '16px 20px',
      border: '2px solid #e8e8e8',
      borderRadius: '12px',
      fontSize: '16px',
      marginBottom: '8px',
      transition: 'border-color 0.2s ease'
    },
    strengthMeter: {
      height: '6px',
      borderRadius: '3px',
      background: '#e0e0e0',
      marginBottom: '8px',
      overflow: 'hidden'
    },
    strengthBar: {
      height: '100%',
      transition: 'all 0.3s ease',
      borderRadius: '3px'
    },
    strengthText: {
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'capitalize'
    },
    passwordHint: {
      fontSize: '14px',
      color: '#666',
      marginTop: '8px',
      padding: '12px 16px',
      background: '#f5f5f5',
      borderRadius: '8px'
    },
    permissionsGroup: {
      marginTop: '32px'
    },
    permissionsTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '16px'
    },
    permissionOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '16px 20px',
      border: '2px solid #e8e8e8',
      borderRadius: '12px',
      marginBottom: '12px',
      background: 'white',
      transition: 'all 0.2s ease'
    },
    permissionCheckbox: {
      width: '20px',
      height: '20px',
      marginRight: '16px',
      cursor: 'pointer'
    },
    permissionContent: {
      flex: 1
    },
    permissionLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333333',
      marginBottom: '4px',
      cursor: 'pointer'
    },
    permissionDesc: {
      fontSize: '14px',
      color: '#666'
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
      background: (file && securityOptions.password) ? 'linear-gradient(135deg, #666666 0%, #333333 100%)' : '#ccc',
      boxShadow: (file && securityOptions.password) ? '0 10px 30px rgba(102, 102, 102, 0.4)' : 'none',
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
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
      default: return '0%';
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
        input:focus { outline: none; border-color: #666666; box-shadow: 0 0 0 3px rgba(102, 102, 102, 0.1); }
      `}</style>

      <div style={styles.maxWidth}>
        <button onClick={goBack} style={styles.backButton}>
          ← Back to Home
        </button>

        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <span>🔒</span>
          </div>
          <h1 style={styles.title}>Secure PDF</h1>
          <p style={styles.subtitle}>Add password protection and security permissions to your PDF</p>
        </div>

        <div style={styles.card}>
          <div style={styles.section}>
            <div style={styles.instructions}>
              <h3 style={styles.instructionTitle}>🔒 How to Secure PDFs:</h3>
              <ul style={styles.instructionList}>
                <li>Select a PDF file that you want to protect</li>
                <li>Create a strong password for maximum security</li>
                <li>Choose what users can do with the protected PDF</li>
                <li>Click "Secure PDF with Password" to generate protected file</li>
                <li>Share the password securely with authorized users</li>
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
                Select one PDF file to secure
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
            <div style={styles.securitySection}>
              <h2 style={styles.securityTitle}>
                <span style={{ fontSize: '28px', marginRight: '12px' }}>🔐</span>
                Security Settings
              </h2>

              <div style={styles.passwordGroup}>
                <label style={styles.passwordLabel}>Password *</label>
                <input
                  type="password"
                  placeholder="Enter a strong password"
                  value={securityOptions.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  style={styles.passwordInput}
                />
                
                {securityOptions.password && (
                  <>
                    <div style={styles.strengthMeter}>
                      <div
                        style={{
                          ...styles.strengthBar,
                          width: getStrengthWidth(),
                          background: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <div
                      style={{
                        ...styles.strengthText,
                        color: getPasswordStrengthColor()
                      }}
                    >
                      Password strength: {passwordStrength}
                    </div>
                  </>
                )}
                
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={securityOptions.confirmPassword}
                  onChange={(e) => setSecurityOptions({...securityOptions, confirmPassword: e.target.value})}
                  style={styles.passwordInput}
                />
                
                <div style={styles.passwordHint}>
                  💡 <strong>Password Tips:</strong> Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols for maximum security.
                </div>
              </div>

              <div style={styles.permissionsGroup}>
                <h3 style={styles.permissionsTitle}>📋 PDF Permissions</h3>
                
                <div style={styles.permissionOption}>
                  <input
                    type="checkbox"
                    checked={securityOptions.permissions.print}
                    onChange={(e) => setSecurityOptions({
                      ...securityOptions,
                      permissions: {...securityOptions.permissions, print: e.target.checked}
                    })}
                    style={styles.permissionCheckbox}
                  />
                  <div style={styles.permissionContent}>
                    <div style={styles.permissionLabel}>Allow Printing</div>
                    <div style={styles.permissionDesc}>Users can print the PDF document</div>
                  </div>
                </div>

                <div style={styles.permissionOption}>
                  <input
                    type="checkbox"
                    checked={securityOptions.permissions.copy}
                    onChange={(e) => setSecurityOptions({
                      ...securityOptions,
                      permissions: {...securityOptions.permissions, copy: e.target.checked}
                    })}
                    style={styles.permissionCheckbox}
                  />
                  <div style={styles.permissionContent}>
                    <div style={styles.permissionLabel}>Allow Copy & Paste</div>
                    <div style={styles.permissionDesc}>Users can copy text and images from the PDF</div>
                  </div>
                </div>

                <div style={styles.permissionOption}>
                  <input
                    type="checkbox"
                    checked={securityOptions.permissions.modify}
                    onChange={(e) => setSecurityOptions({
                      ...securityOptions,
                      permissions: {...securityOptions.permissions, modify: e.target.checked}
                    })}
                    style={styles.permissionCheckbox}
                  />
                  <div style={styles.permissionContent}>
                    <div style={styles.permissionLabel}>Allow Modifications</div>
                    <div style={styles.permissionDesc}>Users can edit and modify the PDF content</div>
                  </div>
                </div>

                <div style={styles.permissionOption}>
                  <input
                    type="checkbox"
                    checked={securityOptions.permissions.annotate}
                    onChange={(e) => setSecurityOptions({
                      ...securityOptions,
                      permissions: {...securityOptions.permissions, annotate: e.target.checked}
                    })}
                    style={styles.permissionCheckbox}
                  />
                  <div style={styles.permissionContent}>
                    <div style={styles.permissionLabel}>Allow Annotations</div>
                    <div style={styles.permissionDesc}>Users can add comments and annotations</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={styles.actionSection}>
            <button
              onClick={handleSubmit}
              disabled={!file || !securityOptions.password || isProcessing}
              style={styles.processButton}
            >
              {isProcessing ? (
                <>
                  <div className="spinner" style={styles.spinner}></div>
                  Securing PDF...
                </>
              ) : (
                <>
                  <span style={{ fontSize: '24px', marginRight: '12px' }}>🔒</span>
                  Secure PDF with Password
                </>
              )}
            </button>
            
            {(!file || !securityOptions.password) && (
              <p style={{ color: '#666', marginTop: '12px' }}>
                Please select a PDF file and enter a password
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Upgrade Modal is now handled by the global context */}
    </div>
  );
}

// /* UPGRADE MODAL RENDER */
export function UpgradeModalRenderer({ show, msg, onClose }) {
  if (!show) return null;
  return <UpgradeModal message={msg} onClose={onClose} />;
}
