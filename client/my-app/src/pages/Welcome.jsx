import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  const currentStage = import.meta.env.VITE_ENVIRONMENT || "unknown";


  return (
    <Container
      fluid
      className="d-flex flex-column justify-content-center align-items-center text-center bg-light vh-100 px-3"
    >
      <div className="p-4 rounded shadow-sm bg-white">
        <h1 className="fw-bold mb-3 display-5 text-primary">Welcome to MyApp</h1>
        <p className="text-muted mb-4 fs-5">
          Experience seamless shopping, smarter dashboards, and a smooth experience.
        </p>

        {/* Print the stage */}
        <p className="text-info fw-bold mb-4">
          Current Stage: {currentStage.toUpperCase()}
        </p>

        <div className="d-flex flex-wrap gap-3 justify-content-center">
          <Button variant="primary" size="lg" onClick={() => navigate("/signup")}>
            Get Started
          </Button>
          <Button variant="outline-primary" size="lg" onClick={() => navigate("/login")}>
            Login
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Welcome;
