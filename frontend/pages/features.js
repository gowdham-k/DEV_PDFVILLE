import React from 'react';
import Head from 'next/head';

export default function Features() {
  return (
    <>
      <Head>
        <title>Features - PDFVille</title>
        <meta name="description" content="PDFVille Features" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Features</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>PDF Conversion</h2>
          <p style={{ lineHeight: '1.6' }}>
            Convert documents to and from PDF format with ease. Support for Word, Excel, PowerPoint, and more.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>PDF Editing</h2>
          <p style={{ lineHeight: '1.6' }}>
            Edit text, images, and other elements in your PDF documents without needing specialized software.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>PDF Merging & Splitting</h2>
          <p style={{ lineHeight: '1.6' }}>
            Combine multiple PDFs into one document or split a large PDF into smaller files.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>PDF Compression</h2>
          <p style={{ lineHeight: '1.6' }}>
            Reduce file size while maintaining quality for easier sharing and storage.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>PDF Security</h2>
          <p style={{ lineHeight: '1.6' }}>
            Add password protection, encryption, and permission controls to your sensitive documents.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>OCR Technology</h2>
          <p style={{ lineHeight: '1.6' }}>
            Convert scanned documents into searchable and editable text with our advanced OCR technology.
          </p>
        </div>
      </div>
    </>
  );
}