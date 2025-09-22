// pages/success.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { API_BASE_URL } from "../components/config";

export default function Success() {
  const router = useRouter();
  const { session_id } = router.query;
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      // Fetch session details
      fetchSessionData(session_id);
    }
  }, [session_id]);

  const fetchSessionData = async (sessionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/checkout-session?session_id=${sessionId}`);
      const data = await response.json();
      setSessionData(data);
    } catch (error) {
      console.error('Error fetching session data:', error);
    } finally {
      setLoading(false);
    }
  };  

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9f9f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        {/* Success Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#22c55e',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          fontSize: '2rem',
          color: '#fff'
        }}>
          ✓
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: '#000',
          fontWeight: '700'
        }}>
          Payment Successful!
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#666',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Thank you for subscribing to PDFVILLE Premium! Your account has been upgraded and you now have access to all premium features.
        </p>

        {sessionData && (
          <div style={{
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ marginBottom: '1rem', color: '#667eea' }}>Order Details</h3>
            <p><strong>Plan:</strong> {sessionData.metadata?.plan || 'Premium'}</p>
            <p><strong>Amount:</strong> ₹{(sessionData.amount_total / 100).toFixed(2)}</p>
            <p><strong>Customer Email:</strong> {sessionData.customer_details?.email}</p>
            <p><strong>Payment Method:</strong> {sessionData.payment_method_types?.[0]}</p>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              backgroundColor: '#667eea',
              color: '#fff',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5a67d8';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#667eea';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Go to Dashboard
          </button>

          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#fff',
              color: '#667eea',
              border: '2px solid #667eea',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#667eea';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = '#667eea';
            }}
          >
            Explore Tools
          </button>
        </div>

        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#e6f3ff',
          borderRadius: '8px',
          fontSize: '0.9rem',
          color: '#0066cc'
        }}>
          <p>
            <strong>What's next?</strong> You'll receive a confirmation email shortly. 
            You can manage your subscription anytime from your account settings.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}