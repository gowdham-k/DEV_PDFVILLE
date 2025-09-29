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
  const [step, setStep] = useState(1); // Step 1: Request code, Step 2: Enter code and new password
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
        setStep(2); // Move to password reset step
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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate confirmation code
    if (!confirmationCode || confirmationCode.trim() === "") {
      setError("Confirmation code is required");
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-black text-white p-6 text-center">
          <h2 className="text-2xl font-bold">Reset Password</h2>
          <p className="mt-1">
            {step === 1
              ? "Enter your email to receive a reset code"
              : "Enter the verification code and your new password"}
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {success}
            </div>
          )}

          {step === 1 ? (
            // Step 1: Request reset code form
            <form onSubmit={handleRequestCode}>
              <div className="mb-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
              </button>
            </form>
          ) : (
            // Step 2: Reset password form with confirmation code
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Confirmation code"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white p-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full mt-2 text-center text-black hover:underline"
              >
                Back to Request Code
              </button>
            </form>
          )}
        </div>
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