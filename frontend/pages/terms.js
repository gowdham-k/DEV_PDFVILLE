import { useRouter } from 'next/router';
import Head from 'next/head';

export default function TermsAndConditions() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Terms and Conditions - PDFVille</title>
        <meta name="description" content="Terms and Conditions for PDFVille" />
      </Head>
      
      <div style={{ 
        padding: '2rem', 
        maxWidth: '900px', 
        margin: '0 auto',
        minHeight: 'calc(100vh - 80px)',
        color: '#333',
        lineHeight: '1.6'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: '700', 
          marginBottom: '1.5rem',
          color: '#000',
          textAlign: 'center'
        }}>
          Terms and Conditions
        </h1>

        <div style={{ 
          backgroundColor: '#fff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          fontSize: '1rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>1. Introduction</h2>
          <p style={{ marginBottom: '1rem' }}>
            Welcome to PDFVille. These Terms and Conditions govern your use of our website and services. 
            By accessing or using PDFVille, you agree to be bound by these Terms. If you disagree with any part of the terms, 
            you may not access our services.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>2. Services Description</h2>
          <p style={{ marginBottom: '1rem' }}>
            PDFVille provides various PDF manipulation tools including but not limited to: merging, splitting, compressing, 
            converting, rotating, unlocking, and watermarking PDFs. Our services are designed to help users manage their 
            PDF documents efficiently and securely.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>3. User Accounts</h2>
          <p style={{ marginBottom: '1rem' }}>
            Some features of our service may require registration for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            You are responsible for safeguarding the password that you use to access our services and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>4. Free and Premium Services</h2>
          <p style={{ marginBottom: '1rem' }}>
            PDFVille offers both free and premium services. Free services may have limitations in terms of file size, number of operations, or available features. Premium services provide enhanced capabilities and are available through subscription plans.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Subscription fees are charged in advance on a monthly or annual basis. You can cancel your subscription at any time, but we do not provide refunds for the current subscription period.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>5. Privacy Policy</h2>
          <p style={{ marginBottom: '1rem' }}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our services, you agree to our Privacy Policy.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>6. Intellectual Property</h2>
          <p style={{ marginBottom: '1rem' }}>
            The service and its original content, features, and functionality are owned by PDFVille and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>7. Limitation of Liability</h2>
          <p style={{ marginBottom: '1rem' }}>
            In no event shall PDFVille, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>8. Changes to Terms</h2>
          <p style={{ marginBottom: '1rem' }}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>9. Contact Us</h2>
          <p style={{ marginBottom: '1rem' }}>
            If you have any questions about these Terms, please contact us at support@pdfville.com.
          </p>

          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
            Last updated: september 29, 2025
          </p>
        </div>
      </div>
    </>
  );
}