import React from "react";
import { Container, Button, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <Navbar 
      expand="lg" 
      fixed="top" 
      className="py-3 shadow-sm" 
      style={{ 
        background: "linear-gradient(90deg, #4c6fff, #6e42d3)",
        transition: "all 0.3s ease" 
      }} 
      variant="dark"
    >
      <Container>
        <Navbar.Brand className="fw-bold fs-4" style={{ letterSpacing: "0.5px" }}>
          <span style={{ color: "#fff" }}>Digital</span>
          <span style={{ color: "#e0e0ff" }}>Marketplace</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/" className="text-white">Home</Nav.Link>
            <Nav.Link href="#features" className="text-white">Features</Nav.Link>
            <Nav.Link href="#pricing" className="text-white">Pricing</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Button 
              variant="outline-light" 
              onClick={() => navigate("/login")} 
              className="me-3 px-4 fw-medium"
              style={{ borderRadius: "20px", borderWidth: "2px" }}
            >
              Login
            </Button>
            <Button 
              variant="light" 
              className="text-primary fw-bold px-4" 
              onClick={() => navigate("/signup")}
              style={{ borderRadius: "20px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}
            >
              Sign Up
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;