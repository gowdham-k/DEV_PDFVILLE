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
          <div style={{ background: '#eafff7', borderLeft: '4px solid #1abc9c', padding: '0.75rem 1rem', borderRadius: '6px', color: '#0e6655', marginBottom: '1rem' }}>
            Please read these Terms carefully. They include service rules, account types, and a detailed matrix of feature restrictions for free vs. premium users.
          </div>
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
          <p style={{ marginBottom: '1rem' }}>
            These Terms explain what you can expect from us and what we expect from you when you use the Service. They describe permitted and prohibited activities, how accounts are managed, and how we handle service modifications. We aim to offer a stable and secure platform for document processing, which requires reasonable limits and safeguards. By using the Service, you acknowledge that online tools inherently involve operational constraints and evolving features. We reserve the right to update functionality to improve reliability and usability, and we will strive to communicate significant changes in a timely manner. You should review these Terms periodically, especially if you use advanced features or rely on the Service for business needs. If you ever have questions about how a specific clause applies to your situation, our support team can provide guidance.
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
          <h3 style={{ fontSize: '1.3rem', marginTop: '1.2rem', marginBottom: '0.8rem', color: '#444' }}>1.2 Prohibited Uses Summary</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.75rem 0 1.25rem' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Activity</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Free</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Premium</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Automated scraping, bots, spiders</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Not allowed</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Not allowed</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>May degrade service and violate fair use</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Excessive task volumes</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Limited</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Monitored</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Accounts may be reviewed for compliance</td>
              </tr>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Credential sharing / password disclosure</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Not allowed</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Not allowed</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Protects account security and privacy</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Circumvention of technical limits</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Not allowed</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Not allowed</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Includes rate-limit bypass, unauthorized access</td>
              </tr>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Malicious activity, spam, harmful content</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Not allowed</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Not allowed</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Strictly prohibited under these Terms</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginBottom: '1rem' }}>
            The Service Rules are designed to keep the platform running smoothly for everyone. Automated scraping, credential sharing, and excessive task volumes degrade performance and can jeopardize security. We monitor usage patterns and may take steps to prevent abuse, including rate limits and account verification. These measures help ensure a fair experience for individual users and organizations alike. If we contact you about unusual activity, please respond promptly so we can resolve issues quickly. In severe cases, we may suspend access to protect the platform and other users; we will notify you whenever feasible and explain the reason for any enforcement action. We encourage responsible use and welcome feedback on how we can balance flexibility with safeguards.
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
            Accounts are intended to reflect varying usage needs, from casual access to professional workflows. Unregistered visitors can try selected tools without saving history, while registered users gain access to basic features and can store preferences. Premium users unlock higher throughput, priority processing, and premium-only features. Regardless of type, you are responsible for safeguarding credentials and for all activity under your account. We may impose reasonable limits to ensure that the platform remains reliable—for example, on daily task volume or concurrent operations. If we detect compromised credentials or unusual behavior, we may require password changes, additional verification, or temporary suspension. Keep your profile information current and contact support if you suspect unauthorized access. Our goal is to provide a secure, consistent experience while accommodating different levels of usage.
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '1rem 0' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Account Type</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Capabilities</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Limits</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}><strong>Not Registered</strong></td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}>Access select tools, no saved history</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}>Strict limits on size/pages/features</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}><strong>Registered</strong></td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}>Access basic features, saved history</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}>Standard free-tier limits</td>
              </tr>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}><strong>Premium</strong></td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}>All features, priority processing</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0', verticalAlign: 'top' }}>No enforced limits on supported features</td>
              </tr>
            </tbody>
          </table>
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
            The free tier is ideal for occasional tasks and light usage. It provides access to core tools with reasonable boundaries that protect platform stability, such as limits on simultaneous uploads, file size, and page count. If you frequently work with larger documents, perform complex operations, or need premium-only features (e.g., protect, unlock, watermark, and scan), upgrading to a premium plan ensures faster processing, higher throughput, and fewer restrictions. We may adjust limits over time to reflect technical improvements and fair use, and we will communicate material changes through our site or in-app notices.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Premium subscriptions renew automatically unless canceled, and you can manage your plan from the account settings page. We display pricing transparently and provide billing history for your records. Upgrades take effect immediately, while downgrades apply at the end of the current billing period. If payment fails, we may suspend premium features until the issue is resolved; we will notify you and provide steps to restore access. Please consult our support resources or contact us if you need assistance choosing a plan that matches your workload.
          </p>
          <h3 style={{ fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: '#444' }}>3.1 Plan Comparison</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.75rem 0 1.25rem' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Feature</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Free</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Max file size</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Up to 10MB</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Up to 1GB</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Max pages per file</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Up to 50 pages</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Unlimited (reasonable use)</td>
              </tr>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Concurrent operations</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>1</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Up to 10</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Priority processing</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>No</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Yes</td>
              </tr>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Premium tools (Protect, Unlock, Watermark, Scan)</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Restricted</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Full access</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Support</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Community resources</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Email support, priority channels</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginBottom: '1rem' }}>
            Limits and features may change over time to reflect maintenance and performance improvements. We strive to keep documentation current and will notify you of material changes. If you need guaranteed capacity, contact us to explore enterprise options.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            As part of our fair use posture, batch operations and elevated compression levels may be limited for free users to preserve capacity. Premium plans are designed for productivity and scale, enabling larger files, more pages, and advanced operations without enforced thresholds. We may provide promotional trials that temporarily lift certain restrictions; trial terms will be displayed when applicable. If you are subject to industry compliance rules (for example, archival requirements), consider whether premium features or dedicated support are suitable for your environment. We welcome feedback about usage caps and performance—community input helps us calibrate limits so the platform remains responsive for everyone.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            The Privacy Policy provides detailed information about categories of data we collect (such as contact details, usage information, and documents you upload), the purposes for processing (including delivering requested features, improving performance, and protecting security), and your choices (for example, cookie preferences and account settings). We do not sell your personal data. We use third-party providers only to the extent necessary to deliver authentication, payments, hosting, and support, subject to appropriate contractual safeguards. You can learn more about retention schedules, international transfers, and your legal rights by reviewing the Privacy Policy page.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            If you have questions regarding privacy practices, please contact us. We will respond within reasonable timeframes and explain applicable decisions. Where consent is required (for example, optional analytics), you may withdraw it at any time. Our goal is to be transparent, minimize data collection, and empower you to control your information.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We encourage you to review cookie preferences and manage tracking where available; essential cookies are required to operate the Service, while optional analytics can be turned off in supported regions. We strive to use privacy-preserving defaults and to retain documents only long enough to provide requested functionality or as required by law. If we request additional data—for example, to diagnose a problem—we will explain the purpose and limit use to the case at hand. You can exercise rights such as access, deletion, and portability as described on the Privacy Policy page. When we rely on legitimate interests, we evaluate necessity and balance with your rights to ensure fairness. We regularly assess our vendors to confirm that appropriate safeguards remain in place.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Except as expressly permitted, you may not copy, modify, distribute, sell, lease, or reverse engineer any part of the Service or associated content. Trademarks, logos, and brand elements are protected; do not use them without written permission. User-generated content processed through tools remains your property, but you grant us a limited, non-exclusive license to process the content solely to provide requested functionality. You are responsible for ensuring you have rights to the files you upload and that your use complies with applicable laws and third-party licenses.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            If you share feedback or suggestions, you grant us a right to use that input to improve the Service without obligation to compensate you. Open-source components used within the platform are subject to their respective licenses; we endeavor to comply with attribution and distribution requirements. If you believe content in the Service infringes your rights, you may submit a notice with sufficient detail to allow us to investigate; we will respond in accordance with applicable law. Please avoid uploading materials that contain proprietary or confidential information unless you have authority to process them. The Service is not a repository for long-term storage; outputs are generated to fulfill requested operations and may be removed afterward per our retention logic.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            To the maximum extent permitted by law, the Service is provided “as is” and “as available.” We disclaim implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that processing results will meet your specific requirements or that service will be uninterrupted. Some jurisdictions do not allow limitations on implied warranties or liability for certain damages; in such cases, our liability will be limited to the fullest extent allowed. If you are dissatisfied with any part of the Service, your sole remedy is to stop using it or, if applicable, cancel your subscription.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            We are not liable for delays or failures caused by events outside our control, such as internet outages, hosting incidents, or changes in third-party libraries. You acknowledge that file processing may be impacted by source content quality, encryption, password protection, or corrupt data. We do not guarantee preservation of document formatting when converting between formats; results can vary based on fonts, images, and embedded resources. To the extent permitted, we exclude liability for lost profits, business interruption, or data loss arising from use of the Service. You should maintain backups of important files and verify outputs before relying on them for critical tasks.
          </p>
          <h3 style={{ fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: '#444' }}>6.1 Processing Outcomes</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.75rem 0 1.25rem' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Scenario</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Example Cause</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Typical Outcome</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Conversion formatting variance</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Missing fonts, embedded resources</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Layout shifts, font substitutions</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Embed fonts, verify outputs</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Password-protected file</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Encryption prevents operations</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Operation fails or requests unlock</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Remove password or use unlock tool</td>
              </tr>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Corrupted input</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Damaged file structure</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Partial or failed processing</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Repair file, re-export from source</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Oversized media assets</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Large images, embedded videos</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Longer processing time</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Compress images, optimize assets</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginBottom: '1rem' }}>
            These scenarios illustrate common limitations inherent to document processing. We encourage testing outputs on non-critical samples before deploying workflows, and maintaining backups of originals.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Changes may reflect updates to features, pricing, restrictions, or legal requirements. When changes are material, we will notify you via website banners, in-product prompts, or email (where appropriate). Continued use of the Service after revised Terms take effect constitutes acceptance. If you do not agree, you must stop using the Service. We encourage periodic review of the Terms so you remain informed about your rights and obligations.
          </p>
          <h3 style={{ fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: '#444' }}>7.1 Changes Matrix</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.75rem 0 1.25rem' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Change Type</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Example</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Notice Method</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Effective Date</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Feature enhancement</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>New tool or improved performance</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>In-product prompt, release notes</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>On release</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Pricing updates</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Adjusted subscription fees</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Email notice, billing page</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Next billing cycle</td>
              </tr>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Policy changes</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Terms or Privacy updates</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Website banner, email where appropriate</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>As specified in notice</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Service limits adjustment</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Concurrency or file size limit changes</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>In-product prompt</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>On enforcement date</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginBottom: '1rem' }}>
            We may also publish version histories or summaries to highlight what has changed, along with guidance on how to adapt workflows if limits or behaviors are updated. For business customers, we may offer advanced notice channels or administrator settings to manage organizational transitions. If any change would significantly reduce functionality you rely on, contact support to discuss alternatives or plan upgrades that meet your needs. Our aim is to evolve responsibly, balancing innovation with the stability expected from document-processing tools.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force and effect. Before initiating formal proceedings, we encourage you to contact support to attempt informal resolution. If a dispute cannot be resolved, the parties agree to jurisdiction and venue as stated above. Nothing in this section limits any rights you may have under mandatory consumer protection laws in your region.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            Conflicts of laws principles will not apply; the governing law and forum specified here control. If you access the Service from outside the stated jurisdiction, you are responsible for compliance with local rules, including any import/export controls affecting document encryption or related technologies. We do not promise that the Service is appropriate or available in every location. If a claim arises, the statute of limitations will be the minimum permitted by law. Class actions and consolidated proceedings are waived to the extent permissible; any dispute must be brought individually.
          </p>
          <h3 style={{ fontSize: '1.3rem', marginTop: '1.5rem', marginBottom: '0.8rem', color: '#444' }}>8.1 Jurisdiction Reference</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '0.75rem 0 1.25rem' }}>
            <thead>
              <tr>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>User Location</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Applicable Law</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Forum</th>
                <th style={{ backgroundColor: '#1abc9c', color: '#fff', padding: '10px', textAlign: 'left', border: '1px solid #b9efe3' }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>United States</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>State law where provider is domiciled</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>State and federal courts</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Individual claims only; class actions waived</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>EU/EEA</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Local consumer protection and mandatory laws</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Local courts where required</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Mandatory rights preserved</td>
              </tr>
              <tr style={{ background: '#fbfffd' }}>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Other regions</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>As permitted by conflict rules</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Designated courts in governing jurisdiction</td>
                <td style={{ padding: '10px', border: '1px solid #e0e0e0' }}>Compliance with import/export controls</td>
              </tr>
            </tbody>
          </table>
          <p style={{ marginBottom: '1rem' }}>
            This table is a non-exhaustive summary. Actual forum and applicable law are determined by the governing clause and mandatory local protections.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            For billing or account-related questions, reach out through the in-app help center to ensure we can verify your identity and discuss sensitive information securely. If you report a suspected security issue or abuse, please include as many details as possible (such as timestamps, tool names, and steps to reproduce) so we can investigate promptly. Your feedback helps us improve the Service and maintain a safe environment for all users.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            If your inquiry concerns data privacy, we may direct you to designated channels to exercise rights or obtain copies of records, consistent with applicable regulations. For technical troubleshooting, please share browser type, device specs, and example files where feasible; we will attempt to replicate the issue and propose workarounds. We aim to respond in a timely manner, prioritize urgent incidents impacting availability, and communicate status transparently.
          </p>
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666', textAlign: 'center' }} suppressHydrationWarning>
            Last updated: {new Date().toISOString().slice(0, 10)}
          </p>
        </div>
      </div>
    </>
  );
}