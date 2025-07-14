import React, { useContext } from "react";
import {
  Container,
  Button,
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { signOut } from "../services/auth";

const Header = () => {
  const navigate = useNavigate();
  const { user, clearUserAfterLogout } = useContext(UserContext);

  const handleLogout = () => {
    signOut();
    clearUserAfterLogout();
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      fixed="top"
      bg="dark"
      variant="dark"
      className="shadow-sm py-2"
      style={{
        background: "linear-gradient(90deg, #4c6fff, #6e42d3)",
        zIndex: 1050,
      }}
    >
      <Container>
        <Navbar.Brand
          onClick={() => navigate("/")}
          className="fw-bold fs-4"
          style={{ cursor: "pointer" }}
        >
          <span className="text-white">Digital</span>
          <span style={{ color: "#e0e0ff" }}>Marketplace</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            {user ? (
              <NavDropdown
                align="end"
                title={user.email || "My Account"}
                id="user-nav-dropdown"
              >
                <NavDropdown.Item onClick={() => navigate("/dashboard")}>
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Button
                  variant="outline-light"
                  className="me-2 fw-medium px-3 rounded-pill"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  variant="light"
                  className="text-primary fw-bold px-3 rounded-pill"
                  style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
