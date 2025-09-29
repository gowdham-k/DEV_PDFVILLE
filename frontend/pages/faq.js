import React from 'react';
import Head from 'next/head';

export default function FAQ() {
  return (
    <>
      <Head>
        <title>FAQ - PDFVille</title>
        <meta name="description" content="Frequently Asked Questions about PDFVille" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Frequently Asked Questions</h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>What is PDFVille?</h3>
          <p style={{ lineHeight: '1.6' }}>
            PDFVille is an online platform that provides tools for creating, editing, converting, and managing PDF documents.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Is PDFVille free to use?</h3>
          <p style={{ lineHeight: '1.6' }}>
            PDFVille offers both free and premium plans. Basic features are available for free, while advanced features require a subscription.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>How secure are my documents?</h3>
          <p style={{ lineHeight: '1.6' }}>
            We take security seriously. All files are encrypted during transit and processing. Files are automatically deleted after processing is complete.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>What file formats can I convert to PDF?</h3>
          <p style={{ lineHeight: '1.6' }}>
            PDFVille supports conversion from various formats including Word, Excel, PowerPoint, JPG, PNG, and more.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Can I edit text in a PDF?</h3>
          <p style={{ lineHeight: '1.6' }}>
            Yes, PDFVille allows you to edit text, images, and other elements in PDF documents.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>How do I merge multiple PDFs?</h3>
          <p style={{ lineHeight: '1.6' }}>
            Upload the PDF files you want to merge, arrange them in the desired order, and click the "Merge" button.
          </p>
        </div>
      </div>
    </>
  );
}