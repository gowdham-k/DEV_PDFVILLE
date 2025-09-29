import { useState } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../components/config";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1); // Step 1: Request code, Step 2: Verify code, Step 3: Reset password
  const router = useRouter();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Reset code sent to your email");
        setStep(2); // Move to verify code step
      } else {
        setError(data.error || "Failed to send reset code");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Instead of making a separate verification call, we'll just move to the next step
    // The actual verification will happen when the user submits the new password
    setStep(3); // Move to reset password step
    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          confirmationCode,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || "Password reset successful");
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="reset-card">
        <div className="header">
          <h2>Reset Password</h2>
          <p>
            {step === 1 
              ? "Request a password reset code" 
              : step === 2 
                ? "Verify your confirmation code" 
                : "Enter your new password"
            }
          </p>
        </div>

        {step === 1 ? (
          <form className="reset-form" onSubmit={handleRequestCode}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="reset-button"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </button>

            <p className="back-text">
              Remember your password? 
              <span 
                onClick={() => router.push("/login")}
                className="back-link"
              >
                Back to Login
              </span>
            </p>
          </form>
        ) : step === 2 ? (
          <form className="reset-form" onSubmit={handleVerifyCode}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="input-group">
              <input
                type="text"
                placeholder="Confirmation Code"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="reset-button"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>

            <p className="back-text">
              <span 
                onClick={() => setStep(1)}
                className="back-link"
              >
                Back to Request Code
              </span>
            </p>
          </form>
        ) : (
          <form className="reset-form" onSubmit={handleResetPassword}>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="input-group">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit" 
              className="reset-button"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            <p className="back-text">
              <span 
                onClick={() => setStep(2)}
                className="back-link"
              >
                Back to Verification
              </span>
            </p>
          </form>
        )}
      </div>

      <style jsx>{`
        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #000000 0%, #333333 100%);
          padding: 1rem;
        }

        .reset-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border: 2px solid #e5e5e5;
          width: 100%;
          max-width: 400px;
          overflow: hidden;
        }

        .header {
          background: linear-gradient(135deg, #000000, #333333);
          color: white;
          padding: 2rem;
          text-align: center;
          border-bottom: 1px solid #ddd;
        }

        .header h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 0.95rem;
        }

        .reset-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #ffffff;
        }

        .error-message {
          background-color: #fff0f0;
          color: #e74c3c;
          padding: 1rem;
          border-radius: 8px;
          border: 2px solid #ffcccc;
          font-size: 0.9rem;
          text-align: center;
          font-weight: 500;
        }

        .success-message {
          background-color: #f0fff0;
          color: #27ae60;
          padding: 1rem;
          border-radius: 8px;
          border: 2px solid #ccffcc;
          font-size: 0.9rem;
          text-align: center;
          font-weight: 500;
        }

        .input-group {
          position: relative;
        }

        input {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          border: 2px solid #cccccc;
          outline: none;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #fff;
          box-sizing: border-box;
          color: #333333;
        }

        input::placeholder {
          color: #888888;
        }

        input:focus {
          border-color: #333333;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
          opacity: 0.7;
          color: #666666;
        }

        .reset-button {
          width: 100%;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #000000, #333333);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .reset-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #333333, #000000);
        }

        .reset-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .reset-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
          background: #888888;
        }

        .back-text {
          text-align: center;
          color: #666666;
          font-size: 0.95rem;
          margin: 0;
        }

        .back-link {
          color: #000000;
          cursor: pointer;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: color 0.3s ease;
        }

        .back-link:hover {
          color: #333333;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .container {
            padding: 0.5rem;
          }
          
          .reset-card {
            margin: 0.5rem;
          }
          
          .header {
            padding: 1.5rem;
          }
          
          .reset-form {
            padding: 1.5rem;
          }
          
          .header h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}