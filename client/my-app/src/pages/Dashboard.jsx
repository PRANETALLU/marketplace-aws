import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Nav,
  Button,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { getProductsBySeller } from "../services/products/api";
import { getOrdersPlaced } from "../services/orders/api";

const Dashboard = () => {
  const { user, loading } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!loading && user) {
      getProductsBySeller().then(setProducts);
      getOrdersPlaced().then(setOrders);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!user) return <p>Please log in to view your dashboard.</p>;

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <Button as={Link} to="/cart" variant="info">
          🛒 View Cart
        </Button>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="profile">👤 Profile Summary</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="products">🧑‍🎨 My Products</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="orders">📦 My Orders</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <Card>
                  <Card.Body>
                    <h5>{user.username}</h5>
                    <p>Email: {user.email}</p>
                    <Button variant="primary">Edit Profile</Button>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="products">
                <h5 className="mb-3">My Products</h5>
                {products.length === 0 ? (
                  <p>You haven't listed any products yet.</p>
                ) : (
                  <ListGroup>
                    {products.map((p) => (
                      <ListGroup.Item key={p.productId}>
                        <strong>{p.productName}</strong> — ${p.price} (Qty:{" "}
                        {p.quantity})
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="orders">
                <h5 className="mb-3">My Orders</h5>
                {orders.length === 0 ? (
                  <p>You haven’t placed any orders yet.</p>
                ) : (
                  <ListGroup>
                    {orders.map((o) => (
                      <ListGroup.Item key={o.orderId}>
                        Order #{o.orderId} — <strong>{o.status}</strong> — $
                        {o.totalPrice}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default Dashboard;
