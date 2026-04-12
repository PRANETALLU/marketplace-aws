import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Container, Spinner, Alert } from "react-bootstrap";
import { signIn } from "../../services/auth";
import { UserContext } from "../../context/UserContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUserAfterLogin } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn(username, password);
      await updateUserAfterLogin();
      navigate("/home");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
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

        .login-container {
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

        .login-container::before {
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

        .login-card {
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

        .login-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .login-title {
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

        .signup-link {
          color: #0d6efd;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .signup-link:hover {
          color: #0a58ca;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 2rem 1.5rem;
          }
          
          .login-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-icon">🔐</div>
          <h3 className="login-title">Welcome Back</h3>

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
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="modern-form-control"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="modern-form-label">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="modern-form-control"
              />
            </Form.Group>

            <Button 
              type="submit" 
              className="w-100 modern-btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center mt-4">
              <small style={{ color: '#64748b' }}>
                Don't have an account?{" "}
                <span 
                  className="signup-link"
                  onClick={() => navigate("/signup")}
                >
                  Sign up
                </span>
              </small>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;