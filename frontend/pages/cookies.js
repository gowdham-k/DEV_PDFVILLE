import React from 'react';
import Head from 'next/head';

export default function Cookies() {
  return (
    <>
      <Head>
        <title>Cookies Policy - PDFVille</title>
        <meta name="description" content="PDFVille Cookies Policy" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Cookies Policy</h1>
        
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          This Cookies Policy explains how PDFVille uses cookies and similar technologies to recognize you when you visit our website.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>What are cookies?</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
          They are widely used to make websites work efficiently and provide information to the website owners.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>How we use cookies</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          We use cookies for the following purposes:
        </p>
        <ul style={{ marginLeft: '2rem', marginBottom: '1rem', lineHeight: '1.6' }}>
          <li>To enable certain functions of the website</li>
          <li>To provide analytics</li>
          <li>To store your preferences</li>
          <li>To enable advertisement delivery</li>
        </ul>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Types of cookies we use</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Essential cookies: These cookies are necessary for the website to function properly.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Preference cookies: These cookies remember your preferences and settings.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Analytics cookies: These cookies help us understand how visitors interact with our website.
        </p>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          Marketing cookies: These cookies track your online activity to help advertisers deliver more relevant advertising.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>How to manage cookies</h2>
        <p style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
          You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. 
          If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
        </p>
      </div>
    </>
  );
}