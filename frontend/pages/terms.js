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
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#333' }}>1. Use of Our Service</h2>
          <p style={{ marginBottom: '1rem' }}>
            Welcome to PDFVille (from this point onwards "the Service"). The Service offers its users solely a web and mobile application 
            which allows users to manipulate documents and/or images through online software.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            The current Terms and Conditions stipulate the legally binding conditions between Yourself (the "User") and the websites, 
            services, and applications of PDFVille (from this point forward, PDFVille).
          </p>
          <p style={{ marginBottom: '1rem' }}>
            By accessing or using PDFVille you agree to be conformant to this Terms and Conditions agreement ("Agreement") whether or not 
            you are registered on our services. In the case of disagreement with all or part of these Terms and Conditions, you should 
            abstain from using the Service.
          </p>
          
          <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem' }}>
            <p style={{ fontStyle: 'italic', color: '#555' }}>
              Please be nice. Don't try to hack our servers, send spam or break any other rules, regulations, or laws. 
              We love working with you, but please don't use our Brand to do anything malicious.
            </p>
          </div>
          
          <p style={{ marginBottom: '1rem' }}>
            By means of acceptance of the current Terms and Conditions, the User agrees to comply with the following service rules:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>To have read and understood what is explained here.</li>
            <li>To have assumed all of the obligations that are stated here.</li>
            <li>To use the service solely for purposes permitted by law and which do not violate the rights of a third-party.</li>
            <li>To not use this website for any unlawful activity. You are prohibited to break any term and condition to not generate content dedicated to creating SPAM or which could provide instructions about how to engage in illegal activities.</li>
            <li>To not gather, handle, or store personal information about other Users or third-parties without complying with the current legislation regarding the protection of information.</li>
          </ul>
          
          <h3 style={{ fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: '#444' }}>1.1 Service Rules</h3>
          <p style={{ marginBottom: '1rem' }}>
            Your use of the Service and PDFVille Desktop is subject to this Reasonable Use Policy, which has been created to ensure 
            that our service is fair for both users and developers. The following is not permitted in connection with PDFVille Services:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Using any automated or non-automated scraping process (including bots, scrapers, and spiders);</li>
            <li>Converting or otherwise editing documents at a rate that exceeds what a human can reasonably do by using manual means and a conventional device;</li>
            <li>Providing your password to any other person or using any other persons username and password to access PDFVille;</li>
            <li>Abusing PDFVille in excess of what is reasonably needed or required for legitimate business or personal purposes. PDFVille may investigate any account that registers over 1000 tasks in a month to determine compliance with this requirement.</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            If PDFVille determines that you are in breach of this policy, we may temporarily or permanently suspend or terminate your account or your subscription to the Service.
          </p>
          
          <h3 style={{ fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: '#444' }}>1.2 Cookies</h3>
          <p style={{ marginBottom: '1rem' }}>
            PDFVille websites are a Software as a Service (SaaS), and use cookies, which are essential for the operations of the service 
            and for its correct functionality. A minimal number of other non-essential cookies will be placed under your consent. 
            In case you do not accept, manage or reject the use of cookies, consent will be granted by using our software; 
            yet you can give or withdraw consent to these from our Cookie Policy page anytime.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>2. Accounts</h2>
          <p style={{ marginBottom: '1rem' }}>
            PDFVille accounts give the user access to the services and functionality that we may establish and maintain from time to time 
            and in our sole discretion. We may maintain different types of accounts for different types of Users. 
            The different account types allow the user to work within different file size and file number limitations. 
            Our Service users' types are as follows:
          </p>
          <ul style={{ marginLeft: '2rem', marginBottom: '1rem' }}>
            <li>Not registered</li>
            <li>Registered</li>
            <li>Premium</li>
          </ul>
          <p style={{ marginBottom: '1rem' }}>
            User is solely responsible for the activity that occurs on his account and must keep his account password secure.
            PDFVille owns the right to totally or partially stop providing any of its Services whenever it considers it appropriate 
            and would only give prior notification to Premium Users.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Some features of our service may require registration for an account. You agree to provide accurate, current, and complete 
            information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            You are responsible for safeguarding the password that you use to access our services and for any activities or actions 
            under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, 
            numbers, and symbols) with your account.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>3. Free and Premium Services</h2>
          <p style={{ marginBottom: '1rem' }}>
            PDFVille offers both free and premium services. Free services may have limitations in terms of file size, number of operations, 
            or available features. Premium services provide enhanced capabilities and are available through subscription plans.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Subscription fees are charged in advance on a monthly or annual basis. You can cancel your subscription at any time, 
            but we do not provide refunds for the current subscription period.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>4. Privacy Policy</h2>
          <p style={{ marginBottom: '1rem' }}>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. 
            By using our services, you agree to our Privacy Policy.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>5. Intellectual Property</h2>
          <p style={{ marginBottom: '1rem' }}>
            All content included on this website, such as text, graphics, logos, button icons, images, audio clips, digital downloads, 
            data compilations, and software, is the property of PDFVille or its content suppliers and protected by international copyright laws.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            The compilation of all content on this site is the exclusive property of PDFVille and protected by international copyright laws. 
            All software used on this site is the property of PDFVille or its software suppliers and protected by international copyright laws.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>6. Limitation of Liability</h2>
          <p style={{ marginBottom: '1rem' }}>
            PDFVille will not be liable for any damages of any kind arising from the use of this site, including, but not limited to 
            direct, indirect, incidental, punitive, and consequential damages.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            PDFVille does not guarantee that the site will be secure or free from bugs or viruses. You are responsible for configuring 
            your information technology, computer programs and platform to access the site. You should use your own virus protection software.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>7. Changes to Terms</h2>
          <p style={{ marginBottom: '1rem' }}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
            we will try to provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>8. Governing Law</h2>
          <p style={{ marginBottom: '1rem' }}>
            These terms and conditions are governed by and construed in accordance with the laws of the United States 
            and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>

          <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: '#333' }}>9. Contact Us</h2>
          <p style={{ marginBottom: '1rem' }}>
            If you have any questions about these Terms, please contact us at support@pdfville.com.
          </p>

          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }}>
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </>
  );
}