import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const currentStage = import.meta.env.VITE_ENVIRONMENT || "unknown";

  return (
    <>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
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

        .welcome-container {
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
          overflow: hidden;
          z-index: 0;
        }

        .welcome-container::before {
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

        .welcome-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 600px;
          width: 100%;
          position: relative;
          z-index: 1;
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.8s ease-out;
          margin-top: 80px;
          margin-bottom: 80px;
        }

        .welcome-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }

        .welcome-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .welcome-subtitle {
          color: #64748b;
          font-size: 1.1rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .stage-badge {
          display: inline-block;
          padding: 0.5rem 1.5rem;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-radius: 12px;
          font-weight: 700;
          color: #0a58ca;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .modern-welcome-btn {
          padding: 0.875rem 2.5rem;
          font-size: 1rem;
          font-weight: 700;
          border-radius: 12px;
          border: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary-modern {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          color: white;
          box-shadow: 0 10px 30px rgba(13, 110, 253, 0.4);
        }

        .btn-primary-modern:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(13, 110, 253, 0.5);
          background: linear-gradient(135deg, #0b5ed7 0%, #084298 100%);
        }

        .btn-outline-modern {
          background: transparent;
          color: #0d6efd;
          border: 2px solid #0d6efd;
          box-shadow: 0 5px 20px rgba(13, 110, 253, 0.2);
        }

        .btn-outline-modern:hover {
          background: #0d6efd;
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(13, 110, 253, 0.4);
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(100, 116, 139, 0.2);
        }

        .feature-item {
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(10, 88, 202, 0.05) 100%);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(13, 110, 253, 0.15);
        }

        .feature-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .feature-text {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .welcome-title {
            font-size: 2rem;
          }
          
          .welcome-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="welcome-container">
        <div className="welcome-card">
          <div className="text-center">
            <div className="welcome-icon">✨</div>
            
            <h1 className="welcome-title">
              Welcome to MyApp
            </h1>
            
            <p className="welcome-subtitle">
              Experience seamless shopping, smarter dashboards, and a smooth experience that brings your ideas to life.
            </p>

            <div className="stage-badge">
              {currentStage.toUpperCase()} Environment
            </div>

            <div className="d-flex flex-wrap gap-3 justify-content-center mb-4">
              <Button
                className="modern-welcome-btn btn-primary-modern"
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
              <Button
                className="modern-welcome-btn btn-outline-modern"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>

            <div className="feature-grid">
              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <div className="feature-text">Fast & Smooth</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">Secure</div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💡</div>
                <div className="feature-text">Intuitive</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Welcome;