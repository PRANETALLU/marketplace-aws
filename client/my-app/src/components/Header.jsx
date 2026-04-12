import React, { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .modern-navbar {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }

        .brand-logo {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .brand-text {
          font-size: 1.5rem;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .user-badge {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.85rem;
          color: #0a58ca;
        }

        .modern-btn {
          border-radius: 12px;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          border: none;
        }

        .btn-logout {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
        }

        .btn-logout:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: white;
        }

        .btn-login {
          background: transparent;
          border: 2px solid rgba(255, 255, 255, 0.4);
          color: white;
        }

        .btn-login:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          color: white;
          border-color: rgba(255, 255, 255, 0.6);
        }

        .btn-signup {
          background: white;
          color: #0d6efd;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
        }

        .btn-signup:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
          color: #0d6efd;
          background: white;
        }

        .navbar-toggler {
          border: none;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        }

        .navbar-toggler:focus {
          box-shadow: none;
          outline: none;
        }
      `}</style>

      <Navbar expand="lg" fixed="top" className="modern-navbar py-0">
        <Container fluid className="px-4">
          <Navbar.Brand
            onClick={() => {
              if (user) {
                navigate("/home");
              } else {
                navigate("/");
              }
            }}
            className="d-flex align-items-center gap-2 py-3"
            style={{ cursor: "pointer" }}
          >
            <div className="brand-logo">
              ✨
            </div>
            <span className="fw-bold text-white brand-text">
              MyApp
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
              {user ? (
                <>
                  <div className="user-badge d-flex align-items-center gap-2">
                    <div className="user-avatar">
                      {user?.username?.charAt(0).toUpperCase() || "G"}
                    </div>
                    <span className="text-white fw-semibold" style={{ fontSize: '0.95rem' }}>
                      {user?.username || "Guest"}
                    </span>
                  </div>
                  
                  <Button
                    onClick={handleLogout}
                    className="modern-btn btn-logout px-3 py-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => navigate("/login")}
                    className="modern-btn btn-login px-4 py-2"
                  >
                    Login
                  </Button>
                  
                  <Button
                    onClick={() => navigate("/signup")}
                    className="modern-btn btn-signup px-4 py-2"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;