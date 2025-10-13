import React from 'react';
import Head from 'next/head';

export default function PrivacyPolicy() {
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '1rem 0',
  };
  const thStyle = {
    backgroundColor: '#2e86de',
    color: '#fff',
    padding: '10px',
    textAlign: 'left',
    border: '1px solid #d0e3ff',
  };
  const tdStyle = {
    padding: '10px',
    border: '1px solid #e0e0e0',
    verticalAlign: 'top',
  };
  const sectionBadge = {
    background: '#eaf2ff',
    borderLeft: '4px solid #2e86de',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    color: '#2456a6',
    marginBottom: '1rem'
  };

  return (
    <>
      <Head>
        <title>Privacy Policy - PDFVille</title>
        <meta name="description" content="PDFVille Privacy Policy" />
      </Head>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem', color: '#333' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#111' }}>Privacy Policy</h1>
        
        <p style={{ marginBottom: '1rem', lineHeight: '1.6', color: '#555' }}>
          Last Updated: {new Date().toLocaleDateString()}
        </p>

        <div style={sectionBadge}>We value your privacy and aim to be transparent about the data we collect, how we use it, and the choices you have. Below you’ll find details along with easy-to-read tables.</div>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Scope and Purpose</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          This PDFVille Privacy Notice ("Notice") applies to you when you provide your personal information to us when communicating with us or interacting with our websites, mobile apps, products, or services ("Services").
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          This Notice describes what personal information we collect, why and when we collect it, how we may use, disclose, and retain it, and what choices or rights you may have about your personal information.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          This Notice does not apply when we:
        </p>
        <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>Collect personal information from applicants for employment or internship through any recruitment channels.</li>
          <li>Process personal information as a service provider or data processor for our enterprise customer(s). If you are an end-user of our enterprise customer(s), you should read that organization's privacy notice and direct any privacy inquiries to it.</li>
          <li>Process when our Services link to third-party websites, including social media. Because we do not control such third-party or social media websites, third parties' privacy practices may differ from ours. We are not responsible for third parties' privacy practices and encourage you to read their privacy notices carefully.</li>
        </ul>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We may change or update this Privacy Notice, including by posting changes on our websites, but we will notify you of any material changes to it as required by law.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Personal Information We Collect</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          The types of personal information we may collect depend on your relationship with us and the Services you use:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Examples</th>
              <th style={thStyle}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>Contact</strong></td>
              <td style={tdStyle}>Name, email, phone, address</td>
              <td style={tdStyle}>Account creation, support, communications</td>
            </tr>
            <tr>
              <td style={tdStyle}><strong>Payment</strong></td>
              <td style={tdStyle}>Billing address, card details (masked), plan info</td>
              <td style={tdStyle}>Subscription processing, fraud prevention</td>
            </tr>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>Usage & Device</strong></td>
              <td style={tdStyle}>IP address, browser type, OS, session logs</td>
              <td style={tdStyle}>Service performance, analytics, security</td>
            </tr>
            <tr>
              <td style={tdStyle}><strong>Documents</strong></td>
              <td style={tdStyle}>Files you upload for processing</td>
              <td style={tdStyle}>Provide requested document services</td>
            </tr>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>Account Access</strong></td>
              <td style={tdStyle}>Username, password, tokens</td>
              <td style={tdStyle}>Authentication and access control</td>
            </tr>
          </tbody>
        </table>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>How We Collect Information</h2>
        <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>Create an account</li>
          <li>Contact us or fill out a form on our websites</li>
          <li>Access or use our Services, with or without an account</li>
          <li>Participate in our surveys</li>
          <li>Sign up for communications from us</li>
          <li>Engage with us on social media or community forums</li>
        </ul>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Cookies</h2>
        <p style={{ marginBottom: '0.75rem' }}>We use essential and optional cookies to operate and improve the Service. You can manage cookie preferences from our Cookies page.</p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Cookie Type</th>
              <th style={thStyle}>Description</th>
              <th style={thStyle}>Example Use</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>Essential</strong></td>
              <td style={tdStyle}>Required to sign in and operate core features</td>
              <td style={tdStyle}>Session management, authentication</td>
            </tr>
            <tr>
              <td style={tdStyle}><strong>Preferences</strong></td>
              <td style={tdStyle}>Remembers settings and choices</td>
              <td style={tdStyle}>Language, theme</td>
            </tr>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>Analytics</strong></td>
              <td style={tdStyle}>Helps us understand usage and improve</td>
              <td style={tdStyle}>Page performance, feature adoption</td>
            </tr>
          </tbody>
        </table>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>How We Use Your Data</h2>
        <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>Register you as a new customer</li>
          <li>Process and deliver your service</li>
          <li>Manage our relationship with you</li>
          <li>Improve website, products/services, and customer experience</li>
          <li>Provide support and respond to your inquiries</li>
          <li>Personalize your experience and content</li>
        </ul>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Data Retention</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We retain account and transactional information for as long as your account is active or as required to provide Services and comply with legal obligations. Uploaded documents may be retained temporarily for processing and are deleted or anonymized after a reasonable period unless you choose otherwise.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Third-Party Services</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We may use trusted third-party providers for authentication and payments (e.g., identity services and payment processors). These providers process limited personal information necessary to deliver their services.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Security</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We implement appropriate technical and organizational measures to safeguard personal information against unauthorized access, alteration, and disclosure.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Service Use and Restrictions Overview</h2>
        <p style={{ marginBottom: '0.75rem' }}>
          To ensure fair use, certain features have limits for free users. Premium users do not have these limits. See the summary below:
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Feature</th>
              <th style={thStyle}>Free Tier</th>
              <th style={thStyle}>Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>General (uploads)</strong></td>
              <td style={tdStyle}>Up to 2 files at once; ≤ 5MB per file; ≤ 10 pages per PDF</td>
              <td style={tdStyle}>No enforced limits</td>
            </tr>
            <tr>
              <td style={tdStyle}><strong>Merge PDF</strong></td>
              <td style={tdStyle}>Up to 2 files; ≤ 5MB per file; ≤ 10 pages per file</td>
              <td style={tdStyle}>No enforced limits</td>
            </tr>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>Convert PDF</strong></td>
              <td style={tdStyle}>Up to 2 files; ≤ 5MB per file; convert ≤ 3 pages</td>
              <td style={tdStyle}>No enforced limits</td>
            </tr>
            <tr>
              <td style={tdStyle}><strong>Compress PDF</strong></td>
              <td style={tdStyle}>1 file at a time; ≤ 5MB; low/medium compression only</td>
              <td style={tdStyle}>High compression and batch supported</td>
            </tr>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>Split PDF</strong></td>
              <td style={tdStyle}>Input ≤ 5MB; input ≤ 10 pages; output ≤ 10 pages per operation</td>
              <td style={tdStyle}>No enforced limits</td>
            </tr>
            <tr>
              <td style={tdStyle}><strong>Edit PDF</strong></td>
              <td style={tdStyle}>Add text annotations only</td>
              <td style={tdStyle}>Shapes, images, and page operations</td>
            </tr>
            <tr style={{ background: '#fbfdff' }}>
              <td style={tdStyle}><strong>Premium-only</strong></td>
              <td style={tdStyle}>Protect/Unlock/Add Watermark/Scan not available</td>
              <td style={tdStyle}>All premium-only features available</td>
            </tr>
            <tr>
              <td style={tdStyle}><strong>Summarize PDF</strong></td>
              <td style={tdStyle}>Available to all users; no free-tier limits</td>
              <td style={tdStyle}>Same</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.95rem', color: '#666' }}>Note: Limits are subject to change as we improve the Service.</p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Your Legal Rights</h2>
        <p style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
        </p>
        <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>Request access to your personal data</li>
          <li>Request correction of your personal data</li>
          <li>Request erasure of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Request restriction of processing your personal data</li>
          <li>Request transfer of your personal data</li>
          <li>Right to withdraw consent</li>
        </ul>

        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Children’s Privacy</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Our Services are not directed to children under 13 and we do not knowingly collect personal information from children.</p>

        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>International Transfers</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>Where applicable, personal information may be processed across regions to provide the Services, subject to appropriate safeguards.</p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Contact Us</h2>
        <p style={{ marginBottom: '0.75rem', lineHeight: '1.6' }}>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
        </p>
        <div style={{ background: '#f7fbff', borderLeft: '4px solid #2e86de', padding: '0.75rem 1rem', borderRadius: '6px' }}>
          Email: privacy@pdfville.com<br />
          Address: 123 PDF Street, Document City, DC 12345
        </div>
      </div>
    </>
  );
}