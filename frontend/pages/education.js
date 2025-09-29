import React from 'react';
import Layout from '../components/layout';
import Head from 'next/head';

export default function Education() {
  return (
    <Layout>
      <Head>
        <title>Education Solutions - PDFVille</title>
        <meta name="description" content="PDFVille Education Solutions" />
      </Head>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Education Solutions</h1>
        
        <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
          PDFVille offers specialized PDF solutions for educational institutions, teachers, and students.
        </p>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Schools & Universities</h2>
          <p style={{ lineHeight: '1.6' }}>
            Manage course materials, student submissions, and administrative documents efficiently with our education-focused PDF tools.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Teachers</h2>
          <p style={{ lineHeight: '1.6' }}>
            Create, edit, and distribute learning materials easily. Add annotations, comments, and feedback to student submissions.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>For Students</h2>
          <p style={{ lineHeight: '1.6' }}>
            Convert notes to PDF, merge research materials, and create professional-looking assignments with our student-friendly tools.
          </p>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Special Education Pricing</h2>
          <p style={{ lineHeight: '1.6' }}>
            We offer special discounts for educational institutions. Contact us to learn more about our education pricing plans.
          </p>
        </div>
      </div>
    </Layout>
  );
}