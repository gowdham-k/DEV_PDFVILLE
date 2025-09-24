import React, { useState } from 'react';
import { Shield, Lock, Eye, FileText, Users, Mail, Globe, Calendar, AlertTriangle, CheckCircle, Server, Database, UserCheck, Scale, Clock, Download, Search, ChevronDown, ChevronUp, Upload, X, Info, Bell, FileCheck, ExternalLink } from 'lucide-react';

export default function PrivacyPolicy() {
  const [expandedSections, setExpandedSections] = useState({});
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const lastUpdated = "June 15, 2024";

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const sections = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: <Eye className="w-5 h-5" />
    },
    {
      id: 'scope-purpose',
      title: 'Scope and Purpose',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'information-collect',
      title: 'Information We Collect',
      icon: <Database className="w-5 h-5" />
    },
    {
      id: 'how-we-collect',
      title: 'How We Collect Information',
      icon: <Download className="w-5 h-5" />
    },
    {
      id: 'how-we-use',
      title: 'How We Use Information',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'legal-basis',
      title: 'Legal Basis for Processing',
      icon: <Scale className="w-5 h-5" />
    },
    {
      id: 'data-processing',
      title: 'Data Processing & Storage',
      icon: <Server className="w-5 h-5" />
    },
    {
      id: 'sharing-disclosure',
      title: 'Information Sharing',
      icon: <Users className="w-5 h-5" />
    },
    {
      id: 'data-security',
      title: 'Security Measures',
      icon: <Lock className="w-5 h-5" />
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies & Tracking',
      icon: <Globe className="w-5 h-5" />
    },
    {
      id: 'international-transfers',
      title: 'International Transfers',
      icon: <ExternalLink className="w-5 h-5" />
    },
    {
      id: 'retention-deletion',
      title: 'Data Retention & Deletion',
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: 'your-rights',
      title: 'Your Privacy Rights',
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      id: 'compliance',
      title: 'Legal Compliance',
      icon: <FileCheck className="w-5 h-5" />
    },
    {
      id: 'changes',
      title: 'Changes to Privacy Policy',
      icon: <Bell className="w-5 h-5" />
    },
    {
      id: 'contact-dpo',
      title: 'Contact & DPO',
      icon: <Mail className="w-5 h-5" />
    }
  ];

  const ExpandableSection = ({ id, title, children, defaultExpanded = false }) => {
    const isExpanded = expandedSections[id] ?? defaultExpanded;
    
    return (
      <div className="border border-gray-200 rounded-lg mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium text-gray-900">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>
        {isExpanded && (
          <div className="px-6 py-4 border-t border-gray-200">
            {children}
          </div>
        )}
      </div>
    );
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-red-600">PDFville</h1>
              </div>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="/" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Home</a>
                <a href="/help" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Help</a>
                <a href="/security" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Security</a>
                <a href="/contact" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Contact</a>
                <a href="/privacy" className="text-gray-900 font-medium px-3 py-2 text-sm border-b-2 border-red-500">Privacy</a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Trust Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>CCPA Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 mr-3 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">Privacy Policy</h2>
              </div>
              <div className="text-sm text-gray-600 mb-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Updated: Sep 24, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>~15 min read</span>
                </div>
              </div>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full text-left flex items-center px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    {section.icon}
                    <span className="ml-2">{section.title}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </button>
                  <button 
                    onClick={() => setShowCookieSettings(!showCookieSettings)}
                    className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Cookie Settings
                  </button>
                  <a href="/data-request" className="w-full text-left text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Request My Data
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Hero Section */}
              <div className="p-8 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Notice</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-900 mb-1">Important Update</h3>
                      <p className="text-sm text-blue-800">
                        We've updated our Privacy Notice to provide more clarity about our data practices and to comply with new regulatory requirements. The key changes include enhanced data subject rights and clearer information about international data transfers.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed">
                  At PDFville, your privacy is fundamental to everything we do. This Privacy Notice explains how we collect, use, share, and protect your personal information when you use our PDF processing services. We are committed to transparency and giving you control over your data.
                </p>
              </div>

              {/* Content Sections */}
              <div className="p-8 space-y-8">

                {/* Privacy Overview */}
                <section id="overview">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Eye className="w-6 h-6 mr-3 text-red-600" />
                    Privacy Overview
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        What We Don't Do
                      </h3>
                      <ul className="text-green-800 text-sm space-y-2">
                        <li>• We never sell your personal data</li>
                        <li>• We don't read the content of your documents</li>
                        <li>• We don't use your files for AI training</li>
                        <li>• We don't keep files longer than necessary</li>
                        <li>• We don't share data for advertising</li>
                      </ul>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                        <Shield className="w-5 h-5 mr-2" />
                        What We Do
                      </h3>
                      <ul className="text-blue-800 text-sm space-y-2">
                        <li>• Process files securely with encryption</li>
                        <li>• Delete files within 1 hour automatically</li>
                        <li>• Comply with GDPR, CCPA, and other laws</li>
                        <li>• Give you full control over your data</li>
                        <li>• Maintain ISO 27001 certification</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Information We Collect */}
                <section id="information-collect">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Database className="w-6 h-6 mr-3 text-red-600" />
                    Personal Information We Collect
                  </h2>
                  
                  <ExpandableSection id="files-uploaded" title="Files and Documents" defaultExpanded={true}>
                    <div className="space-y-4 mt-4">
                      <p className="text-gray-600">
                        When you upload files to PDFville, we temporarily process these files to provide the requested service. We do not access, read, or analyze the content of your documents beyond what is necessary for processing.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <p className="text-yellow-800 text-sm font-medium">File Retention: All uploaded files are automatically and permanently deleted within 1 hour of processing completion.</p>
                      </div>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection id="account-info" title="Account Information">
                    <div className="space-y-4 mt-4">
                      <p className="text-gray-600">If you create an account with us, we collect:</p>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>Email address (required)</li>
                        <li>Name (optional)</li>
                        <li>Profile picture (optional)</li>
                        <li>Account preferences and settings</li>
                        <li>Subscription and billing information (for paid plans)</li>
                      </ul>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection id="usage-data" title="Usage and Technical Information">
                    <div className="space-y-4 mt-4">
                      <p className="text-gray-600">We automatically collect certain technical information:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Device Information</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• IP address</li>
                            <li>• Browser type and version</li>
                            <li>• Operating system</li>
                            <li>• Device type and screen resolution</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Usage Analytics</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Features used</li>
                            <li>• Time spent on platform</li>
                            <li>• Error logs and crash reports</li>
                            <li>• Performance metrics</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </ExpandableSection>
                  
                  <ExpandableSection id="location-info" title="Location Information">
                    <div className="space-y-4 mt-4">
                      <p className="text-gray-600">We may collect location information:</p>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>Physical location when you sign up for or use our Services</li>
                        <li>Coarse or precise location information when you sign electronic documents</li>
                        <li>IP-based location for security and compliance purposes</li>
                      </ul>
                    </div>
                  </ExpandableSection>
                </section>

                {/* How We Use Information */}
                <section id="how-we-use">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-blue-500" />
                    How We Use Your Information
                  </h2>
                  <p className="mb-4">
                    We use your personal information for the following purposes:
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Service Provision</h3>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>Provide and maintain our PDF processing services</li>
                        <li>Process and complete your transactions</li>
                        <li>Manage your account and preferences</li>
                        <li>Fulfill your requests and orders</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Communication</h3>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>Send technical notices and security alerts</li>
                        <li>Provide customer support and respond to inquiries</li>
                        <li>Send service updates and administrative messages</li>
                        <li>Communicate about new features (with consent)</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Improvement & Analysis</h3>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>Improve and optimize our services</li>
                        <li>Monitor usage patterns and performance</li>
                        <li>Develop new products and features</li>
                        <li>Conduct research and analysis</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2">Security & Compliance</h3>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>Protect against unauthorized access</li>
                        <li>Detect and prevent fraud and abuse</li>
                        <li>Debug and fix errors in our services</li>
                        <li>Comply with legal obligations</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm text-blue-800">
                      <strong>Marketing Communications:</strong> We may send you marketing communications about our services only with your explicit consent. You can opt out of these communications at any time by clicking the "unsubscribe" link in any marketing email or updating your preferences in your account settings.
                    </p>
                  </div>
                </section>

                {/* Data Processing & Storage */}
                <section id="data-processing">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Server className="w-6 h-6 mr-3 text-red-600" />
                    Data Processing & Storage
                  </h2>
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Processing Workflow</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                          <Upload className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                          <div className="text-xs font-medium">1. Upload</div>
                        </div>
                        <p className="text-xs text-gray-600">Encrypted transfer to secure servers</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                          <FileText className="w-8 h-8 mx-auto text-green-600 mb-2" />
                          <div className="text-xs font-medium">2. Process</div>
                        </div>
                        <p className="text-xs text-gray-600">Automated processing in isolated environment</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                          <Download className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                          <div className="text-xs font-medium">3. Deliver</div>
                        </div>
                        <p className="text-xs text-gray-600">Secure delivery to your device</p>
                      </div>
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
                          <AlertTriangle className="w-8 h-8 mx-auto text-red-600 mb-2" />
                          <div className="text-xs font-medium">4. Delete</div>
                        </div>
                        <p className="text-xs text-gray-600">Automatic deletion within 1 hour</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Data Centers</h4>
                      <p className="text-gray-600 text-sm">Our primary data centers are located in the EU (Germany) and US (Virginia), both SOC 2 Type II certified with 24/7 monitoring and physical security.</p>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Backup & Recovery</h4>
                      <p className="text-gray-600 text-sm">System backups are encrypted and stored separately. Personal files are never included in backups - only account data and system configurations.</p>
                    </div>
                  </div>
                </section>

                {/* Information Sharing */}
                <section id="sharing-disclosure">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Users className="w-6 h-6 mr-3 text-red-600" />
                    Information Sharing & Disclosure
                  </h2>
                  <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
                    <h3 className="font-bold text-red-900 mb-2">We Do NOT Sell Your Data</h3>
                    <p className="text-red-800">PDFville has never sold, and will never sell, your personal information to third parties for any purpose, including advertising or marketing.</p>
                  </div>
                  
                  <ExpandableSection id="service-providers" title="Trusted Service Providers">
                    <div className="space-y-4 mt-4">
                      <p className="text-gray-600">We work with carefully selected service providers who help us operate our platform:</p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Cloud Infrastructure</h4>
                          <p className="text-sm text-gray-600">AWS, Google Cloud (for secure file processing)</p>
                        </div>
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Payment Processing</h4>
                          <p className="text-sm text-gray-600">Stripe, PayPal (for subscription billing)</p>
                        </div>
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Analytics</h4>
                          <p className="text-sm text-gray-600">Google Analytics (anonymized data only)</p>
                        </div>
                        <div className="border border-gray-200 p-4 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-2">Customer Support</h4>
                          <p className="text-sm text-gray-600">Intercom, Zendesk (for support tickets)</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic">All service providers are bound by strict data processing agreements and cannot use your data for their own purposes.</p>
                    </div>
                  </ExpandableSection>

                  <ExpandableSection id="legal-disclosure" title="Legal Requirements">
                    <div className="space-y-4 mt-4">
                      <p className="text-gray-600">We may disclose information when required by law:</p>
                      <ul className="list-disc pl-6 text-gray-600 space-y-1">
                        <li>Court orders and legal processes</li>
                        <li>Law enforcement requests with proper warrants</li>
                        <li>Protection of our rights, property, or safety</li>
                        <li>Prevention of fraud or illegal activities</li>
                      </ul>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <p className="text-blue-800 text-sm"><strong>Transparency:</strong> We maintain a transparency report and will notify users of legal requests when legally permitted.</p>
                      </div>
                    </div>
                  </ExpandableSection>
                </section>

                {/* Security Measures */}
                <section id="data-security">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Lock className="w-6 h-6 mr-2 text-blue-500" />
                    Security Measures
                  </h2>
                  
                  <div className="bg-gray-50 p-5 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-900 mb-3">Our Security Commitment</h3>
                    <p className="mb-4">
                      Protecting your data is our top priority. We implement industry-standard technical, administrative, and physical safeguards designed to protect your information, including:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Shield className="h-5 w-5 text-blue-500 mr-2" />
                          Encryption
                        </h4>
                        <p className="text-sm text-gray-600">
                          All data is encrypted in transit using TLS/SSL technology and at rest using AES-256 encryption standards.
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Key className="h-5 w-5 text-blue-500 mr-2" />
                          Access Controls
                        </h4>
                        <p className="text-sm text-gray-600">
                          Strict access controls limit data access to authorized personnel only, with multi-factor authentication required.
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                          <Lock className="h-5 w-5 text-blue-500 mr-2" />
                          Secure Infrastructure
                        </h4>
                        <p className="text-sm text-gray-600">
                          Our systems are hosted in SOC 2 compliant data centers with 24/7 monitoring, intrusion detection, and regular security audits.
                        </p>
                      </div>
                      
                      <div className="bg-white p-4 rounded shadow-sm">
                        <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                          <ClipboardCheck className="h-5 w-5 text-blue-500 mr-2" />
                          Regular Testing
                        </h4>
                        <p className="text-sm text-gray-600">
                          We conduct regular security assessments, vulnerability scanning, and penetration testing to identify and address potential security issues.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <p className="mb-4">
                    While we implement strong security measures, no method of transmission over the Internet or electronic storage is 100% secure. We continuously improve our security practices to protect your data, but cannot guarantee absolute security.
                  </p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">Payment Security</h3>
                    <p className="text-blue-700">
                      All payment information is processed through PCI-DSS compliant payment processors. We never store your complete credit card information on our servers.
                    </p>
                  </div>
                  
                  <p className="mb-4">
                    We maintain security incident response procedures and will notify you promptly in the event of a security breach affecting your personal data, in accordance with applicable laws.
                  </p>
                </section>
                  
                  {/* International Transfers */}
                  <section id="international-transfers" className="mb-12">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Globe className="w-6 h-6 mr-2 text-blue-500" />
                      International Transfers
                    </h2>
                    <p className="mb-4">
                      PDFville operates globally, which means your information may be transferred to, stored, and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Transfer Safeguards</h3>
                        <p className="mb-2">When we transfer your information to other countries, we use appropriate safeguards such as:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Standard Contractual Clauses approved by the European Commission</li>
                          <li>Data Processing Agreements with our service providers</li>
                          <li>Compliance with Privacy Shield frameworks where applicable</li>
                          <li>Binding Corporate Rules for intra-group transfers</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <h3 className="text-xl font-semibold mb-3 text-gray-800">Your Rights</h3>
                        <p className="mb-2">If you are located in the EEA, UK, or Switzerland:</p>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>You can request information about our data transfer mechanisms</li>
                          <li>You can obtain a copy of the safeguards we use for your personal data</li>
                          <li>Contact our Data Protection Officer at <span className="text-blue-600">dpo@pdfville.com</span> for more information</li>
                        </ul>
                      </div>
                    </div>
                  </section>
                  
                  {/* Children's Privacy */}
                  <section id="childrens-privacy">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Users className="w-6 h-6 mr-2 text-blue-500" />
                      Children's Privacy
                    </h2>
                    <p className="mb-4">
                      Our Services are not intended for use by children under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us at privacy@pdfville.com. If we become aware that we have collected personal information from children without verification of parental consent, we will take steps to remove that information from our servers.
                    </p>
                  </section>
                  
                  {/* Changes to This Privacy Policy */}
                  <section id="changes">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FileCheck className="w-6 h-6 mr-2 text-blue-500" />
                      Changes to This Privacy Policy
                    </h2>
                    <p className="mb-4">
                      We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
                    </p>
                    <p className="mb-4">
                      You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                    </p>
                  </section>
                  
                  {/* Contact Us */}
                  <section id="contact">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Mail className="w-6 h-6 mr-2 text-blue-500" />
                      Contact Us
                    </h2>
                    <p className="mb-4">
                      If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <ul className="list-disc pl-6 mb-6 space-y-2">
                      <li>By email: privacy@pdfville.com</li>
                      <li>By visiting our contact page: www.pdfville.com/contact</li>
                      <li>By mail: PDFville Inc., 123 Document Street, Suite 456, San Francisco, CA 94107, USA</li>
                    </ul>
                    <div className="bg-blue-50 p-6 rounded-lg mb-6">
                      <h3 className="text-xl font-semibold text-blue-800 mb-3">Data Protection Officer</h3>
                      <p className="text-blue-700 mb-2">Our Data Protection Officer can be contacted at:</p>
                      <p className="text-blue-700">dpo@pdfville.com</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}
