import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Container
      fluid
      className="text-center d-flex align-items-center"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
        minHeight: "100vh",
        paddingTop: "120px", // Space for fixed navbar
        paddingBottom: "60px",
      }}
    >
      <Row className="justify-content-center w-100">
        <Col lg={8} md={10} className="py-5 px-4 px-md-5">
          <h1
            className="display-3 fw-bold mb-4"
            style={{ color: "#2d3748", letterSpacing: "-0.5px" }}
          >
            Welcome to the{" "}
            <span style={{ color: "#4c6fff" }}>Digital Marketplace</span>
          </h1>
          <p className="lead text-secondary fs-5 mb-5">
            A seamless platform to buy, sell, and trade goods and services
            worldwide — with secure transactions and a trusted user experience.
          </p>

          {/* Call-to-Action */}
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              variant="primary"
              size="lg"
              className="px-4 rounded-pill fw-semibold"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button
              variant="outline-primary"
              size="lg"
              className="px-4 rounded-pill fw-semibold"
              onClick={() => navigate("/login")}
            >
              Already a user?
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;
