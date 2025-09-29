import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About Us - PDFVille</title>
        <meta name="description" content="About PDFVille" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>About PDFVille</h1>
        
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
          PDFVille was founded in 2020 with a simple mission: to make PDF management accessible to everyone.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Our Mission</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
          We believe that working with PDF documents should be simple, efficient, and accessible to all.
          Our mission is to provide powerful yet easy-to-use tools that help individuals and businesses
          manage their documents effectively.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Our Team</h2>
        <p style={{ marginBottom: '1.5rem', lineHeight: '1.6' }}>
          Our team consists of passionate developers, designers, and PDF experts who are dedicated to
          creating the best PDF experience on the web. With decades of combined experience in document
          management, we understand the challenges users face and build solutions to address them.
        </p>
        
        <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Our Values</h2>
        <ul style={{ marginLeft: '2rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
          <li>User-centered design</li>
          <li>Privacy and security</li>
          <li>Continuous innovation</li>
          <li>Accessibility for all</li>
          <li>Environmental responsibility</li>
        </ul>
      </div>
    </Layout>
  );
}