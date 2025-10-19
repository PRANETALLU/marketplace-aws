import React, { useContext } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();      // uses context logout
    navigate("/login");  // redirect after logout
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" fixed="top" className="shadow-sm py-2">
      <Container fluid>
        <Navbar.Brand
          onClick={() => {
            if (user) {
              navigate("/home"); // authenticated users go to Home
            } else {
              navigate("/"); // unauthenticated users go to landing or login
            }
          }}
          className="fw-bold text-white fs-4"
          style={{ cursor: "pointer" }}
        >
          MyApp
        </Navbar.Brand>


        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-white">
                  Welcome, <strong>{user?.username || "Guest"}</strong>
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-light" size="sm" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="light" size="sm" onClick={() => navigate("/signup")}>
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
