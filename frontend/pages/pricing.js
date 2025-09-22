"use client";
import { useState, useContext } from "react";
import { CategoryContext } from "../components/layout";
import { loadStripe } from '@stripe/stripe-js';
import { API_BASE_URL } from "../components/config";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const plans = [
  {
    name: "Basic",
    price: "Free",
    priceId: null, // No Stripe price ID for free plan
    users: "1",
    features: [
      "Limited Tools Access",
      "Process 5 Documents/month",
      "Standard PDF Viewer",
      "Basic Security",
      "No Digital Signatures",
      "Single Device Access",
      "Basic Compression Tools",
      "Limited Conversion Options",
      "Watermark on PDFs",
      "Email Support",
    ],
    btnText: "Start for Free",
    popular: false,
  },
  {
    name: "Premium",
    price: "₹200 / month",
    priceId: "price_1RysTKSGlE9lg1kM7ONgaYqG", // Replace with your actual Stripe price ID
    users: "1-25",
    features: [
      "All Basic Tools + More",
      "Unlimited Document Processing",
      "Advanced PDF Editor",
      "Digital Signatures",
      "Cross-Device Access",
      "Priority Support",
      "Advanced Compression Tools",
      "Extended Conversion Options",
      "No Watermark",
      "Collaboration Features",
    ],
    btnText: "Go Premium",
    popular: true,
  },
  {
    name: "Business",
    price: "Let's Talk",
    priceId: null, // Custom pricing - handled differently
    users: "25+",
    features: [
      "All Premium Features",
      "Custom Workflow Automation",
      "Dedicated Account Manager",
      "Single Sign-On (SSO)",
      "Regional File Processing",
      "Advanced Security Controls",
      "Enterprise Collaboration Tools",
      "Custom Contracts",
      "Priority SLA Support",
      "Team Analytics Dashboard",
    ],
    btnText: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    category: "General Questions",
    questions: [
      { q: "What do I get with the Free Plan?", a: "With the Free Plan, you get limited access to our tools, allowing you to try essential features without any cost." },
      { q: "Why should I upgrade to Premium?", a: "Premium provides unlimited access to all tools, advanced features, digital signatures, and cross-device support." },
      { q: "Can I switch plans if my needs change?", a: "Absolutely! You can upgrade or downgrade your plan anytime according to your requirements." },
    ],
  },
  {
    category: "Billing & Payments",
    questions: [
      { q: "Can I share single billing for multiple accounts?", a: "Yes, Premium and Business plans support consolidated billing for multiple users." },
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, and net banking through Stripe." },
      { q: "What if I need to change my plan partway through my contract?", a: "You can upgrade or downgrade anytime, and billing will be adjusted accordingly." },
      { q: "Can you invoice me?", a: "Yes, invoices can be generated for Business plan subscriptions." },
      { q: "Is my payment information secure?", a: "Yes, all payments are processed securely through Stripe with industry-standard encryption." },
    ],
  },
];

export default function PricingPage() {
  const [faqOpen, setFaqOpen] = useState({});
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useContext(CategoryContext);

  const toggleFaq = (catIdx, qIdx) => {
    setFaqOpen((prev) => ({
      ...prev,
      [`${catIdx}-${qIdx}`]: !prev[`${catIdx}-${qIdx}`],
    }));
  };

  const handleSubscription = async (plan) => {
    if (plan.name === "Basic") {
      // Handle free plan signup/login redirect
      if (!isAuthenticated) {
        // Redirect to signup page
        window.location.href = "/signup";
      } else {
        // User is already authenticated, redirect to dashboard or tools
        window.location.href = "/";
      }
      return;
    }

    if (plan.name === "Business") {
      // Handle contact sales
      window.location.href = "mailto:sales@localhost?subject=Business Plan Inquiry";
      return;
    }

    // Handle Premium plan with Stripe
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name,
        }),
      });

      const session = await response.json();

      if (session.error) {
        console.error('Error creating checkout session:', session.error);
        alert('Failed to start checkout process. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (error) {
        console.error('Stripe redirect error:', error);
        alert('Payment redirect failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      fontFamily: "Arial, sans-serif", 
      color: "#000", 
      backgroundColor: "#f9f9f9", 
      minHeight: "100vh"
    }}>
      {/* Hero Section */}
      <div style={{ 
        textAlign: "center", 
        padding: "4rem 2rem 2rem 2rem",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff"
      }}>
        <h1 style={{ 
          fontSize: "3rem", 
          marginBottom: "1rem", 
          fontWeight: "700" 
        }}>
          Choose the plan that suits you
        </h1>
        <p style={{ 
          fontSize: "1.2rem", 
          opacity: 0.9, 
          maxWidth: "600px", 
          margin: "0 auto" 
        }}>
          Unlock the full potential of PDF management with our flexible pricing plans
        </p>
      </div>

      {/* Pricing Plans */}
      <div style={{ 
        padding: "3rem 2rem", 
        maxWidth: "1200px", 
        margin: "0 auto" 
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "2rem", 
          flexWrap: "wrap" 
        }}>
          {plans.map((plan, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#fff",
                borderRadius: "20px",
                padding: "2.5rem 2rem",
                width: "350px",
                minHeight: "550px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                boxShadow: plan.popular 
                  ? "0 20px 40px rgba(102, 126, 234, 0.3)" 
                  : "0 10px 30px rgba(0,0,0,0.1)",
                border: plan.popular ? "3px solid #667eea" : "1px solid #e0e0e0",
                position: "relative",
                transform: plan.popular ? "scale(1.05)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.15)";
                }
              }}
              onMouseLeave={(e) => {
                if (!plan.popular) {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                }
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: "-12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, #667eea, #764ba2)",
                  color: "#fff",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  fontWeight: "600"
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <h2 style={{ 
                  fontSize: "1.5rem", 
                  marginBottom: "0.5rem", 
                  color: plan.popular ? "#667eea" : "#000" 
                }}>
                  {plan.name}
                </h2>
                <p style={{ 
                  fontSize: "2rem", 
                  fontWeight: "700", 
                  color: plan.popular ? "#667eea" : "#000",
                  marginBottom: "0.5rem" 
                }}>
                  {plan.price}
                </p>
                <p style={{ 
                  fontSize: "0.9rem", 
                  color: "#666" 
                }}>
                  Up to {plan.users} users
                </p>
              </div>

              <ul style={{ 
                listStyle: "none", 
                padding: 0, 
                marginBottom: "2rem" 
              }}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={{ 
                    marginBottom: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "0.95rem",
                    color: "#333"
                  }}>
                    <span style={{ 
                      color: "#22c55e", 
                      marginRight: "0.8rem", 
                      fontSize: "1.2rem" 
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                style={{
                  width: "100%",
                  padding: "1rem",
                  border: "none",
                  borderRadius: "12px",
                  backgroundColor: plan.popular ? "#667eea" : "#000",
                  color: "#fff",
                  fontWeight: "600",
                  fontSize: "1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  opacity: loading ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = plan.popular ? "#5a67d8" : "#333";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = plan.popular ? "#667eea" : "#000";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
                onClick={() => handleSubscription(plan)}
                disabled={loading}
              >
                {loading && plan.name === "Premium" ? "Processing..." : plan.btnText}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Comparison Section */}
      <div style={{ 
        padding: "3rem 2rem", 
        maxWidth: "1200px", 
        margin: "0 auto",
        background: "#fff",
        borderRadius: "20px",
        marginBottom: "3rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "2rem", 
          fontSize: "2rem", 
          fontWeight: "600",
          color: "#000"
        }}>
          Compare Features
        </h2>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: "0",
            minWidth: "700px",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f8f9fa" }}>
                <th style={{ 
                  padding: "1rem", 
                  textAlign: "left",
                  fontWeight: "600",
                  color: "#000"
                }}>
                  Feature
                </th>
                <th style={{ 
                  padding: "1rem", 
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#000"
                }}>
                  Basic
                </th>
                <th style={{ 
                  padding: "1rem", 
                  textAlign: "center", 
                  backgroundColor: "#667eea", 
                  color: "#fff",
                  fontWeight: "600"
                }}>
                  Premium
                </th>
                <th style={{ 
                  padding: "1rem", 
                  textAlign: "center",
                  fontWeight: "600",
                  color: "#000"
                }}>
                  Business
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Mobile Access", "❌", "✅", "✅"],
                ["Simple eSignature (SES)", "Limited", "Unlimited", "Unlimited"],
                ["Signature Request (SES)", "5/month", "Unlimited", "Unlimited"],
                ["Advanced eSignature (AES)", "❌", "Starting at 5/month", "Custom"],
                ["Signed document custody", "✅", "✅", "✅"],
                ["Audit Trail", "❌", "✅", "✅"],
                ["Notifications & reminders", "❌", "✅", "✅"],
                ["Custom branding", "❌", "✅", "✅"],
                ["Templates", "❌", "✅", "✅"],
                ["API Access", "❌", "✅", "✅"],
                ["SSO Integration", "❌", "❌", "✅"],
                ["Dedicated Support", "❌", "❌", "✅"],
              ].map((row, idx) => (
                <tr key={idx} style={{ 
                  backgroundColor: idx % 2 === 0 ? "#fff" : "#f8f9fa",
                  transition: "background-color 0.2s ease"
                }}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} style={{
                      padding: "1rem",
                      textAlign: cIdx === 0 ? "left" : "center",
                      borderBottom: "1px solid #e9ecef",
                      fontSize: "0.95rem",
                      color: cIdx === 0 ? "#000" : "#333"
                    }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div style={{ 
        padding: "3rem 2rem", 
        maxWidth: "1000px", 
        margin: "0 auto" 
      }}>
        <h2 style={{ 
          textAlign: "center", 
          marginBottom: "3rem", 
          fontSize: "2rem",
          fontWeight: "600",
          color: "#000"
        }}>
          Frequently Asked Questions
        </h2>
        
        {faqs.map((cat, catIdx) => (
          <div key={catIdx} style={{ marginBottom: "2rem" }}>
            <h3 style={{ 
              marginBottom: "1.5rem",
              fontSize: "1.3rem",
              fontWeight: "600",
              color: "#667eea"
            }}>
              {cat.category}
            </h3>
            
            {cat.questions.map((qItem, qIdx) => (
              <div
                key={qIdx}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  marginBottom: "1rem",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
                onClick={() => toggleFaq(catIdx, qIdx)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ 
                  padding: "1.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <p style={{ 
                    margin: 0, 
                    fontWeight: "600",
                    fontSize: "1rem",
                    color: "#000"
                  }}>
                    {qItem.q}
                  </p>
                  <span style={{
                    fontSize: "1.2rem",
                    color: "#667eea",
                    transition: "transform 0.3s ease",
                    transform: faqOpen[`${catIdx}-${qIdx}`] ? "rotate(45deg)" : "rotate(0deg)"
                  }}>
                    +
                  </span>
                </div>
                
                {faqOpen[`${catIdx}-${qIdx}`] && (
                  <div style={{
                    padding: "0 1.5rem 1.5rem 1.5rem",
                    borderTop: "1px solid #f0f0f0",
                    backgroundColor: "#f8f9fa"
                  }}>
                    <p style={{ 
                      margin: "1rem 0 0 0", 
                      color: "#666",
                      lineHeight: "1.6"
                    }}>
                      {qItem.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        padding: "4rem 2rem",
        textAlign: "center",
        marginTop: "3rem"
      }}>
        <h2 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "1rem",
          fontWeight: "700"
        }}>
          Ready to get started?
        </h2>
        <p style={{ 
          fontSize: "1.2rem", 
          marginBottom: "2rem", 
          opacity: 0.9,
          maxWidth: "600px",
          margin: "0 auto 2rem auto"
        }}>
          Join thousands of users who trust PDFVILLE for their document management needs
        </p>
        <button
          style={{
            background: "#fff",
            color: "#667eea",
            border: "none",
            padding: "1rem 2rem",
            borderRadius: "50px",
            fontSize: "1.1rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
          }}
          onClick={() => window.location.href = isAuthenticated ? "/pricing" : "/signup"}
        >
          {isAuthenticated ? "Upgrade Now" : "Get Started Free"}
        </button>
      </div>
    </div>
  );
}