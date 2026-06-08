import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import { signUp } from "../../services/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signUp(formData.username, formData.email, formData.password);
      setSuccess(true);
      // Auto-redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .signup-container {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(-45deg, #0d6efd, #0a58ca, #3b82f6, #60a5fa);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          padding-top: 5rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
          z-index: 0;
        }

        .signup-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s ease-in-out infinite;
        }

        .signup-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 450px;
          width: 100%;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.8s ease-out;
        }

        .signup-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .signup-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 2rem;
          text-align: center;
        }

        .modern-form-label {
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .modern-form-control {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: white;
        }

        .modern-form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
          outline: none;
        }

        .modern-btn-primary {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          border: none;
          border-radius: 12px;
          padding: 0.875rem;
          font-weight: 700;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(13, 110, 253, 0.4);
        }

        .modern-btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(13, 110, 253, 0.5);
          background: linear-gradient(135deg, #0b5ed7 0%, #084298 100%);
        }

        .modern-btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .modern-alert {
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #991b1b;
          padding: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .login-link {
          color: #0d6efd;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .login-link:hover {
          color: #0a58ca;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .signup-card {
            padding: 2rem 1.5rem;
          }
          
          .signup-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-icon">🚀</div>
          <h3 className="signup-title">Create Account</h3>

          {success && (
            <div style={{
              borderRadius: 12,
              background: "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
              color: "#065f46",
              padding: "1rem",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              textAlign: "center",
            }}>
              ✅ Account created! Redirecting to login…
            </div>
          )}

          {error && (
            <div className="modern-alert">
              <strong>Error:</strong> {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="modern-form-label">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="modern-form-control"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="modern-form-label">Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="modern-form-control"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="modern-form-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="modern-form-control"
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 modern-btn-primary" 
              disabled={loading || success}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating account...
                </>
              ) : success ? (
                "Account Created!"
              ) : (
                "Sign Up"
              )}
            </Button>

            <div className="text-center mt-4">
              <small style={{ color: '#64748b' }}>
                Already have an account?{" "}
                <span 
                  className="login-link"
                  onClick={() => navigate("/login")}
                >
                  Login
                </span>
              </small>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Signup;