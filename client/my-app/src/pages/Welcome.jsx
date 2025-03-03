import React from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaLock, FaGlobe, FaCreditCard, FaArrowRight, FaUsers, FaHeadset } from "react-icons/fa";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section with more visual appeal */}
      <Container fluid 
        className="text-center d-flex align-items-center" 
        style={{ 
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
          minHeight: "100vh",
          paddingTop: "80px" 
        }}
      >
        <Row className="justify-content-center w-100">
          <Col lg={8} className="py-5">
            <h1 className="display-3 fw-bold mb-4" style={{ color: "#2d3748", letterSpacing: "-0.5px" }}>
              Welcome to the <span style={{ color: "#4c6fff" }}>Digital Marketplace</span>
            </h1>
            <p className="lead text-secondary fs-5 mb-5 px-md-5">
              A seamless platform to buy, sell, and trade goods and services worldwide with 
              secure transactions and trusted user experience.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="primary" 
                size="lg" 
                className="px-4 py-3 fw-medium d-flex align-items-center" 
                onClick={() => navigate("/signup")}
                style={{ 
                  borderRadius: "30px", 
                  background: "linear-gradient(90deg, #4c6fff, #6e42d3)",
                  border: "none",
                  boxShadow: "0 10px 20px rgba(76, 111, 255, 0.3)"
                }}
              >
                Get Started <FaArrowRight className="ms-2" />
              </Button>
              <Button 
                variant="light" 
                size="lg" 
                className="px-4 py-3 fw-medium"
                onClick={() => navigate("/login")}
                style={{ 
                  borderRadius: "30px",
                  border: "1px solid #e2e8f0",
                  color: "#4a5568"
                }}
              >
                Learn More
              </Button>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Features Section with enhanced cards */}
      <Container className="py-5 my-5">
        <Row className="text-center mb-5">
          <Col>
            <h2 className="fw-bold mb-4" style={{ color: "#2d3748" }}>Why Choose Our Platform</h2>
            <div className="mx-auto" style={{ width: "50px", height: "4px", background: "#4c6fff", marginBottom: "20px" }}></div>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "700px" }}>
              We provide state-of-the-art solutions to make your trading experience seamless and secure.
            </p>
          </Col>
        </Row>
        
        <Row className="g-4">
          {[
            { 
              icon: <FaLock size={35} />, 
              title: "Secure Transactions", 
              description: "Protected by AWS and Cognito authentication for your safety and peace of mind.",
              color: "#4c6fff" 
            },
            { 
              icon: <FaGlobe size={35} />, 
              title: "Global Reach", 
              description: "Connect with buyers and sellers worldwide without borders or limitations.",
              color: "#38b2ac" 
            },
            { 
              icon: <FaCreditCard size={35} />, 
              title: "Easy Payments", 
              description: "Integrated Stripe API for fast, secure, and hassle-free payment processing.",
              color: "#e53e3e" 
            },
            { 
              icon: <FaUsers size={35} />, 
              title: "Community Driven", 
              description: "A trusted user base with verified profiles and rating system.",
              color: "#805ad5" 
            },
            { 
              icon: <FaHeadset size={35} />, 
              title: "24/7 Support", 
              description: "Our dedicated team is always available to assist you with any issues.",
              color: "#dd6b20" 
            },
          ].map((feature, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card 
                className="border-0 h-100 p-4 text-center"
                style={{ 
                  borderRadius: "12px",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 5px 15px rgba(0,0,0,0.05)";
                }}
              >
                <div className="d-flex align-items-center justify-content-center mb-4">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle" 
                    style={{ 
                      width: "80px", 
                      height: "80px", 
                      backgroundColor: `${feature.color}15`,
                      color: feature.color
                    }}
                  >
                    {feature.icon}
                  </div>
                </div>
                <h4 className="fw-bold mb-3" style={{ color: "#2d3748" }}>{feature.title}</h4>
                <p className="text-muted mb-4">{feature.description}</p>
                <Button 
                  variant="link" 
                  className="text-decoration-none d-flex align-items-center justify-content-center" 
                  style={{ color: feature.color }}
                >
                  Learn more <FaArrowRight className="ms-2" size={14} />
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      
      {/* Add Testimonial Section */}
      <Container fluid className="py-5 text-center" style={{ background: "#f8fafc" }}>
        <Container className="py-4">
          <h2 className="fw-bold mb-5" style={{ color: "#2d3748" }}>What Our Users Say</h2>
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="border-0 p-5" style={{ borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="fs-3 me-1" style={{ color: "#f6ad55" }}>★</span>
                  ))}
                </div>
                <p className="fs-5 mb-4 fst-italic text-muted">
                  "The Digital Marketplace has transformed how I do business. Secure payments and a user-friendly interface make it my go-to platform for all transactions."
                </p>
                <div>
                  <h5 className="fw-bold mb-1">Sarah Johnson</h5>
                  <p className="text-muted">Small Business Owner</p>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>
      
      {/* Call to Action */}
      <Container fluid className="text-center py-5" style={{ 
        background: "linear-gradient(90deg, #4c6fff, #6e42d3)",
        color: "white" 
      }}>
        <Row className="justify-content-center">
          <Col md={8} className="py-4">
            <h2 className="fw-bold mb-4">Ready to Get Started?</h2>
            <p className="fs-5 mb-4">Join thousands of satisfied users on our platform today.</p>
            <Button 
              variant="light" 
              size="lg" 
              className="px-5 py-3 fw-bold text-primary"
              onClick={() => navigate("/signup")}
              style={{ 
                borderRadius: "30px",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
              }}
            >
              Sign Up Now
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Welcome;