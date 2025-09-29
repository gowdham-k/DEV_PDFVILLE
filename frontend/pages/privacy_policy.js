import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Head>
        <title>Privacy Policy - PDFVille</title>
        <meta name="description" content="PDFVille Privacy Policy" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Privacy Policy</h1>
        
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>1. Introduction</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Welcome to PDFVille. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you about how we look after your personal data when you visit our website 
          and tell you about your privacy rights and how the law protects you.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>2. Data We Collect</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </p>
        <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>Identity Data: includes first name, last name, username or similar identifier</li>
          <li>Contact Data: includes email address and telephone numbers</li>
          <li>Technical Data: includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform</li>
          <li>Usage Data: includes information about how you use our website and services</li>
        </ul>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>3. How We Use Your Data</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>To register you as a new customer</li>
          <li>To process and deliver your service</li>
          <li>To manage our relationship with you</li>
          <li>To improve our website, products/services, marketing or customer relationships</li>
        </ul>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>4. Data Security</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. 
          In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>5. Your Legal Rights</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
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
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>6. Contact Us</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Email: privacy@pdfville.com<br />
          Address: 123 PDF Street, Document City, DC 12345
        </p>
      </div>
    </Layout>
  );
}