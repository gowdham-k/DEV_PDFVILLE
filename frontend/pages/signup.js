// pages/signup.js
import { useState } from "react";
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API_BASE_URL } from "../components/config";

export default function Signup() {
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const validateForm = () => {
    if (!signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (signupForm.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupForm.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: signupForm.email,
          password: signupForm.password,
          firstName: signupForm.firstName,
          lastName: signupForm.lastName
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! Please check your email for verification code.');
        setShowConfirmation(true);
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignup = async (e) => {
    e.preventDefault();
    
    if (!confirmationCode) {
      setError('Please enter the confirmation code');
      return;
    }

    setConfirmationLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/confirm-signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: signupForm.email,
          confirmationCode: confirmationCode
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email verified successfully! Redirecting to homepage...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setError(data.error || 'Confirmation failed');
      }
    } catch (error) {
      console.error("Confirmation error:", error);
      setError('Network error. Please try again.');
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/resend-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: signupForm.email
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Confirmation code sent! Check your email.');
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch (error) {
      console.error("Resend error:", error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="container">
        <form className="login-form" onSubmit={handleConfirmSignup}>
          <h2>Check Your Email</h2>
          <p className="info-text">We sent a confirmation code to {signupForm.email}</p>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <input
            type="text"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            placeholder="Enter verification code"
            maxLength="6"
            required
          />
          <button type="submit" disabled={confirmationLoading}>
            {confirmationLoading ? 'Verifying...' : 'Verify Email'}
          </button>
          <p className="signup-text">
            <button type="button" onClick={handleResendCode} className="link-button" disabled={loading}>
              Resend code
            </button>
          </p>
          <p className="signup-text">
            <Link href="/login">Back to Login</Link>
          </p>
        </form>

        <style jsx>{`
          .container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f4f4f4;
          }

          .login-form {
            background-color: #ffffff;
            padding: 2.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            width: 350px;
          }

          h2 {
            text-align: center;
            color: #333333;
            margin-bottom: 1rem;
          }

          .info-text {
            text-align: center;
            color: #666;
            margin-bottom: 1.5rem;
            font-size: 0.9rem;
          }

          .error-message {
            background-color: #fee;
            color: #c33;
            padding: 0.8rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 0.9rem;
          }

          .success-message {
            background-color: #efe;
            color: #3c3;
            padding: 0.8rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            text-align: center;
            font-size: 0.9rem;
          }

          input {
            padding: 0.9rem;
            margin-bottom: 1.2rem;
            border-radius: 8px;
            border: 1px solid #ddd;
            outline: none;
            font-size: 1rem;
            text-align: center;
          }

          input:focus {
            border-color: #6666ff;
            box-shadow: 0 0 5px rgba(102, 102, 255, 0.3);
          }

          button {
            padding: 0.9rem;
            border: none;
            border-radius: 8px;
            background-color: #6666ff;
            color: #fff;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
          }

          button:hover:not(:disabled) {
            background-color: #5555ee;
          }

          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .link-button {
            background: none;
            color: #6666ff;
            border: none;
            font-weight: normal;
            text-decoration: underline;
            padding: 0;
            font-size: 0.95rem;
          }

          .link-button:hover:not(:disabled) {
            background: none;
          }

          .signup-text {
            text-align: center;
            margin-top: 1rem;
            color: #555555;
            font-size: 0.95rem;
          }

          .signup-text :global(a) {
            color: #6666ff;
            text-decoration: none;
            font-weight: bold;
          }

          .signup-text :global(a):hover {
            text-decoration: underline;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="container">
      <form className="login-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <input
          type="text"
          name="firstName"
          placeholder="Full Name"
          value={`${signupForm.firstName} ${signupForm.lastName}`.trim()}
          onChange={(e) => {
            const [first, ...rest] = e.target.value.split(' ');
            setSignupForm({
              ...signupForm,
              firstName: first || '',
              lastName: rest.join(' ')
            });
          }}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={signupForm.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={signupForm.password}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={signupForm.confirmPassword}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        <p className="signup-text">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </form>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f4f4f4;
        }

        .login-form {
          background-color: #ffffff;
          padding: 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          width: 350px;
        }

        h2 {
          text-align: center;
          color: #333333;
          margin-bottom: 2rem;
        }

        .error-message {
          background-color: #fee;
          color: #c33;
          padding: 0.8rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 0.9rem;
        }

        .success-message {
          background-color: #efe;
          color: #3c3;
          padding: 0.8rem;
          border-radius: 4px;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 0.9rem;
        }

        input {
          padding: 0.9rem;
          margin-bottom: 1.2rem;
          border-radius: 8px;
          border: 1px solid #ddd;
          outline: none;
          font-size: 1rem;
        }

        input:focus {
          border-color: #6666ff;
          box-shadow: 0 0 5px rgba(102, 102, 255, 0.3);
        }

        button {
          padding: 0.9rem;
          border: none;
          border-radius: 8px;
          background-color: #6666ff;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }

        button:hover:not(:disabled) {
          background-color: #5555ee;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .signup-text {
          text-align: center;
          margin-top: 1.5rem;
          color: #555555;
          font-size: 0.95rem;
        }

        .signup-text :global(a) {
          color: #6666ff;
          text-decoration: none;
          font-weight: bold;
        }

        .signup-text :global(a):hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}