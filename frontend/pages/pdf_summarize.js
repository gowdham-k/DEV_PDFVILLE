"use client";
import { useState } from 'react';
import { API_BASE_URL } from "../components/config";

export default function SummarizePDF() {
  const [file, setFile] = useState(null);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAI, setIsAI] = useState(false);
  const [email, setEmail] = useState("");

  const handleFile = (e) => setFile(e.target.files[0] || null);

  const handlePreview = async () => {
    if (!file) return;
    setIsProcessing(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('query', query);
    fd.append('enable_ocr', 'auto');
    if (isAI) fd.append('email', email);
    try {
      const endpoint = isAI ? '/api/pdf-summarize-ai-preview' : '/api/pdf-summarize-preview';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', body: fd });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok) {
        if (ct.includes('application/json')) {
          const errData = await res.json();
          throw new Error(errData.error || 'Preview failed');
        } else {
          const txt = await res.text();
          throw new Error(`Preview failed: ${txt.slice(0,200)}`);
        }
      }
      if (ct.includes('application/json')) {
        const data = await res.json();
        setPreview(data);
      } else {
        const txt = await res.text();
        throw new Error('Unexpected response format from server');
      }
    } catch (err) {
      alert(err.message || 'Preview failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;
    setIsProcessing(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('query', query);
    fd.append('enable_ocr', 'auto');
    if (isAI) fd.append('email', email);
    try {
      const endpoint = isAI ? '/api/pdf-summarize-ai' : '/api/pdf-summarize';
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', body: fd });
      const ct = res.headers.get('content-type') || '';
      if (!res.ok) {
        if (ct.includes('application/json')) {
          const errData = await res.json();
          throw new Error(errData.error || 'Summarize failed');
        } else {
          const txt = await res.text();
          throw new Error(`Summarize failed: ${txt.slice(0,200)}`);
        }
      }
      if (ct.includes('application/pdf')) {
        const blob = await res.blob();
        const cd = res.headers.get('Content-Disposition');
        let name = isAI ? 'summarized_ai.pdf' : 'summarized.pdf';
        if (cd) {
          const m = cd.match(/filename="(.+)"/i); if (m) name = m[1];
        }
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = name; a.click();
        window.URL.revokeObjectURL(url);
      } else if (ct.includes('application/json')) {
        const data = await res.json();
        throw new Error(data.error || 'Unexpected JSON response');
      } else {
        const txt = await res.text();
        throw new Error(`Unexpected response: ${txt.slice(0,200)}`);
      }
    } catch (err) {
      alert(err.message || 'Summarize failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const styles = {
    container:{maxWidth:'900px',margin:'0 auto',padding:'24px'},
    card:{background:'#fff',padding:'24px',borderRadius:'12px',boxShadow:'0 2px 12px rgba(0,0,0,0.06)'},
    title:{fontSize:'28px',fontWeight:700,marginBottom:'8px'},
    subtitle:{color:'#666',marginBottom:'16px'},
    input:{margin:'12px 0'},
    btn:{padding:'10px 16px',border:'none',borderRadius:'8px',cursor:'pointer',marginRight:'8px',background:'#0070f3',color:'#fff'},
    secBtn:{padding:'10px 16px',border:'1px solid #ddd',borderRadius:'8px',cursor:'pointer',background:'#fff'},
    pre:{background:'#f7f7f7',padding:'12px',borderRadius:'8px',whiteSpace:'pre-wrap'}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>PDF Summarization</h1>
        <p style={styles.subtitle}>Generate a concise summary page, search content, and download the summarized PDF.</p>
        <input type="file" accept=".pdf" onChange={handleFile} style={styles.input} />
        <input type="text" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Optional: search keyword" style={{...styles.input,padding:'10px',width:'100%'}} />
        <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
          <label style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <input type="checkbox" checked={isAI} onChange={e=>setIsAI(e.target.checked)} />
            Use AI (Premium)
          </label>
          {isAI && (
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter premium account email" style={{...styles.input,padding:'10px',flex:1}} />
          )}
        </div>
        <div style={{marginTop:'8px'}}>
          <button onClick={handlePreview} style={styles.btn} disabled={isProcessing || !file}>Preview Summary</button>
          <button onClick={handleGenerate} style={styles.secBtn} disabled={isProcessing || !file}>Generate & Download PDF</button>
        </div>
        {isProcessing && <p style={{marginTop:'12px'}}>Processing...</p>}
        {preview && (
          <div style={{marginTop:'16px'}}>
            <h3>Summary Preview</h3>
            <div style={styles.pre}>{preview.summary}</div>
            {preview.matches && preview.matches.length>0 && (
              <div style={{marginTop:'12px'}}>
                <h4>Content Search Results</h4>
                {preview.matches.map(m=> (
                  <div key={m.page} style={{marginBottom:'8px'}}>
                    <strong>Page {m.page} – {m.count} matches</strong>
                    <ul>
                      {m.snippets.map((s, i)=> <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}