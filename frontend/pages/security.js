import React from 'react';
import Head from 'next/head';

export default function Security() {
  return (
    <>
      <Head>
        <title>Security - PDFVille</title>
        <meta name="description" content="PDFVille Security Information" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Security</h1>
        
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          At PDFVille, we take the security of your data seriously. Here's how we protect your information.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Data Encryption</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          All data transmitted between your browser and our servers is encrypted using industry-standard TLS/SSL protocols.
          Your files are encrypted both in transit and at rest.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Secure Infrastructure</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Our application is hosted on secure cloud infrastructure with multiple layers of security controls,
          including firewalls, intrusion detection systems, and regular security audits.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>File Privacy</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Your files are processed on our secure servers and are automatically deleted after processing is complete.
          We do not store your files longer than necessary to provide our services.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Account Security</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We implement strong password policies and offer two-factor authentication to protect your account.
          Regular security reviews ensure that our authentication systems remain secure.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Compliance</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          PDFVille complies with industry security standards and regulations to ensure the highest level of security for our users.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Contact Us</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          If you have any questions about our security practices or want to report a security issue, please contact us at:
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Email: security@pdfville.com
        </p>
      </div>
    </>
  );
}