import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';

export default function Contact() {
  return (
    <Layout>
      <Head>
        <title>Contact Us - PDFVille</title>
        <meta name="description" content="Contact PDFVille" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Contact Us</h1>
        
        <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
          We'd love to hear from you! Please use the form below or contact us directly.
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Contact Information</h2>
          <p style={{ lineHeight: '1.6' }}>Email: support@pdfville.com</p>
          <p style={{ lineHeight: '1.6' }}>Phone: +1 (555) 123-4567</p>
          <p style={{ lineHeight: '1.6' }}>Address: 123 PDF Street, Document City, DC 12345</p>
        </div>
        
        <form style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
            <input 
              type="text" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }} 
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
            <input 
              type="email" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }} 
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Subject</label>
            <input 
              type="text" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }} 
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Message</label>
            <textarea 
              rows="5" 
              style={{ 
                width: '100%', 
                padding: '0.5rem', 
                border: '1px solid #ccc', 
                borderRadius: '4px' 
              }}
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            style={{ 
              backgroundColor: '#0070f3', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </Layout>
  );
}