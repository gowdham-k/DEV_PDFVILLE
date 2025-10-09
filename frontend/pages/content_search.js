import { useState, useEffect } from "react";
import Head from "next/head";
import { API_BASE_URL } from "../components/config";
import HubspotTracking, { trackEvent } from "../components/HubspotTracking";
import Button from "../components/Button";
import { useUpgrade } from "../context/UpgradeContext";

export default function ContentSearchPage() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [extractAll, setExtractAll] = useState(false);
  const { showUpgradeModal, setShowUpgradeModal, upgradeMessage, setUpgradeMessage } = useUpgrade();

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setResults(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFiles(Array.from(e.dataTransfer.files));
      setResults(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      setErrorMessage("Please select a PDF file.");
      return;
    }
    if (!extractAll && !query.trim()) {
      setErrorMessage("Enter a search term or enable Extract All.");
      return;
    }

    trackEvent('content_search_started');
    setIsProcessing(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('query', query);
      formData.append('extract_all', extractAll);

      const response = await fetch(`${API_BASE_URL}/api/search_extract_pdf`, {
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
          setErrorMessage(data.error || "Failed to process PDF.");
        }
        setIsProcessing(false);
        return;
      }

      setResults(data);
      trackEvent('content_search_completed');
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred while processing the PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = {
    container: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' },
    header: { textAlign: 'center', marginBottom: '2rem' },
    title: { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' },
    subtitle: { fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' },
    form: { marginTop: '2rem' },
    fileUpload: { border: '2px dashed #ccc', borderRadius: '8px', padding: '2rem', textAlign: 'center', marginBottom: '2rem', backgroundColor: dragActive ? '#f0f9ff' : '#f9f9f9', cursor: 'pointer', transition: 'all 0.3s ease' },
    fileUploadActive: { borderColor: '#3498db', backgroundColor: '#f0f9ff' },
    fileInput: { display: 'none' },
    uploadIcon: { fontSize: '3rem', marginBottom: '1rem', color: '#3498db' },
    uploadText: { fontSize: '1.2rem', color: '#666', marginBottom: '0.5rem' },
    uploadSubtext: { fontSize: '0.9rem', color: '#999' },
    searchSettings: { marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    settingsTitle: { fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#333' },
    settingsRow: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    settingsLabel: { fontSize: '1rem', color: '#555' },
    inputText: { padding: '0.6rem 0.8rem', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem' },
    checkboxRow: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
    buttonContainer: { display: 'flex', justifyContent: 'center', marginTop: '2rem' },
    resultsContainer: { marginTop: '2rem' },
    resultCard: { padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    errorMessage: { backgroundColor: '#ffebee', color: '#c62828', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', textAlign: 'center' }
  };

  return (
    <div>
      <Head>
        <title>Content Search & Extract - Find and Extract Information from PDF</title>
        <meta name="description" content="Search for specific content in your PDF and extract relevant text snippets or full text per page." />
      </Head>

      <HubspotTracking />

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Content Search & Extract</h1>
          <p style={styles.subtitle}>Search PDFs for keywords and extract matching snippets or extract all text per page.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {errorMessage && (<div style={styles.errorMessage}>{errorMessage}</div>)}

          <div
            style={{ ...styles.fileUpload, ...(dragActive ? styles.fileUploadActive : {}) }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <div style={styles.uploadIcon}>📄</div>
            <p style={styles.uploadText}>
              {files.length > 0 ? `Selected: ${files[0].name}` : 'Drag & drop your PDF file here or click to browse'}
            </p>
            <p style={styles.uploadSubtext}>Supports PDF files up to 10MB</p>
            <input type="file" id="file-input" style={styles.fileInput} onChange={handleFileChange} accept=".pdf" />
          </div>

          <div style={styles.searchSettings}>
            <h3 style={styles.settingsTitle}>Search Settings</h3>
            <div style={styles.settingsRow}>
              <label style={styles.settingsLabel}>Keyword or phrase</label>
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g., invoice number" style={styles.inputText} disabled={extractAll} />
            </div>
            <div style={styles.checkboxRow}>
              <input type="checkbox" id="extract-all" checked={extractAll} onChange={(e) => setExtractAll(e.target.checked)} />
              <label htmlFor="extract-all">Extract all text per page (ignore keyword)</label>
            </div>
          </div>

          <div style={styles.buttonContainer}>
            <Button type="submit" disabled={isProcessing || files.length === 0} isLoading={isProcessing} loadingText={extractAll ? "Extracting..." : "Searching..."}>
              {extractAll ? "Extract Text" : "Search & Extract"}
            </Button>
          </div>
        </form>

        {results && (
          <div style={styles.resultsContainer}>
            {results.pages ? (
              <div>
                <h3>Extracted Text</h3>
                {results.pages.map((p) => (
                  <div key={p.page} style={styles.resultCard}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Page {p.page}</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{p.text || '(No text found)'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h3>Search Results</h3>
                <div style={{ marginBottom: '0.5rem' }}>Total matches: {results.total_matches}</div>
                {results.results.length === 0 ? (
                  <div style={styles.resultCard}>No matches found.</div>
                ) : (
                  results.results.map((r) => (
                    <div key={r.page} style={styles.resultCard}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Page {r.page} • {r.count} match(es)</div>
                      {r.snippets.map((s, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: s }} />
                      ))}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}