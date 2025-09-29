import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';

export default function Business() {
  return (
    <Layout>
      <Head>
        <title>Business Solutions - PDFVille</title>
        <meta name="description" content="PDFVille Business Solutions" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Business Solutions</h1>
        
        <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
          PDFVille offers powerful PDF solutions designed specifically for businesses of all sizes.
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Enterprise PDF Management</h2>
          <p style={{ lineHeight: '1.6' }}>
            Streamline document workflows with our enterprise-grade PDF management system.
            Centralize document control, implement approval processes, and ensure compliance.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Team Collaboration</h2>
          <p style={{ lineHeight: '1.6' }}>
            Enable seamless collaboration with shared workspaces, real-time editing, and version control.
            Keep your team productive with our intuitive collaboration tools.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>API Integration</h2>
          <p style={{ lineHeight: '1.6' }}>
            Integrate PDFVille's powerful PDF processing capabilities directly into your business applications
            with our comprehensive API solutions.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Custom Solutions</h2>
          <p style={{ lineHeight: '1.6' }}>
            Our team can develop custom PDF solutions tailored to your specific business requirements.
            Contact us to discuss your needs.
          </p>
        </div>
      </div>
    </Layout>
  );
}