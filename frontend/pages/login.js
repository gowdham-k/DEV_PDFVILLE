import { useState } from "react";
import { useRouter } from "next/router";
import { API_BASE_URL } from "../components/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("userEmail", email); // 👈 add this
        console.log("Login successful, token saved"); // Debug log
        
        // Redirect to home page
        router.push("/");
        
        // Force page reload to update authentication state
        setTimeout(() => {
          window.location.reload();
        }, 100);
        
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <div className="header">
          <h2>Welcome Back</h2>
          <p>Sign in to access your PDF tools</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

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

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="forgot-password-container">
            <span 
              onClick={() => router.push("/reset-password")}
              className="forgot-password-link"
            >
              Forgot Password?
            </span>
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <p className="signup-text">
            Don't have an account? 
            <span 
              onClick={() => router.push("/signup")}
              className="signup-link"
            >
              Create Account
            </span>
          </p>
        </form>
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

        .login-card {
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

        .login-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          background: #ffffff;
        }

        .error-message {
          background-color: #f8f8f8;
          color: #333333;
          padding: 1rem;
          border-radius: 8px;
          border: 2px solid #cccccc;
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

        .forgot-password-container {
          text-align: right;
          margin-top: -1rem;
        }

        .forgot-password-link {
          color: #555555;
          font-size: 0.85rem;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .forgot-password-link:hover {
          color: #000000;
          text-decoration: underline;
        }

        .login-button {
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

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          background: linear-gradient(135deg, #333333, #000000);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
          background: #888888;
        }

        .divider {
          text-align: center;
          position: relative;
          margin: 0.5rem 0;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #cccccc;
          z-index: 1;
        }

        .divider span {
          background: white;
          padding: 0 1rem;
          color: #666666;
          font-size: 0.9rem;
          position: relative;
          z-index: 2;
        }

        .signup-text {
          text-align: center;
          color: #666666;
          font-size: 0.95rem;
          margin: 0;
        }

        .signup-link {
          color: #000000;
          cursor: pointer;
          font-weight: 600;
          margin-left: 0.5rem;
          transition: color 0.3s ease;
        }

        .signup-link:hover {
          color: #333333;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .container {
            padding: 0.5rem;
          }
          
          .login-card {
            margin: 0.5rem;
          }
          
          .header {
            padding: 1.5rem;
          }
          
          .login-form {
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