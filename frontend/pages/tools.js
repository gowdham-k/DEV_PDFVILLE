import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';

export default function Tools() {
  return (
    <Layout>
      <Head>
        <title>Tools - PDFVille</title>
        <meta name="description" content="PDFVille Tools" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>PDF Tools</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div style={{ padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>PDF to Word</h3>
            <p>Convert PDF documents to editable Word files</p>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Word to PDF</h3>
            <p>Convert Word documents to PDF format</p>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>PDF Merger</h3>
            <p>Combine multiple PDF files into one document</p>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>PDF Splitter</h3>
            <p>Split PDF into multiple documents</p>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>PDF Compressor</h3>
            <p>Reduce PDF file size while maintaining quality</p>
          </div>
          
          <div style={{ padding: '1.5rem', border: '1px solid #eaeaea', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '1rem' }}>PDF Editor</h3>
            <p>Edit text and images in PDF documents</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}