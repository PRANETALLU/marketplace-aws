import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Tab, Nav, ListGroup, Button, Spinner } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { getProductsBySeller } from "../services/products/api";
import { getOrdersPlaced } from "../services/orders/api";
import CreateProductForm  from "../components/CreateProductForm";

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

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
  if (!user) return <p className="text-center mt-5">Please log in to view your dashboard.</p>;

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column shadow-sm rounded p-3 bg-light">
              <Nav.Item><Nav.Link eventKey="profile">👤 Profile Summary</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="products">🧑‍🎨 My Products</Nav.Link></Nav.Item>
              <Nav.Item><Nav.Link eventKey="orders">📦 My Orders</Nav.Link></Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="profile">
                <Card className="shadow-sm mb-3">
                  <Card.Body>
                    <h5>{user.username}</h5>
                    <p>Email: {user.email}</p>
                    <Button variant="primary">Edit Profile</Button>
                  </Card.Body>
                </Card>
              </Tab.Pane>

              <Tab.Pane eventKey="products">
                <h5 className="mb-3">My Products</h5>

                <CreateProductForm onProductCreated={(newProduct) => setProducts([newProduct, ...products])} />

                {products.length === 0 ? <p>No products listed yet.</p> : (
                  <ListGroup>
                    {products.map(p => (
                      <ListGroup.Item key={p.productId} className="d-flex justify-content-between align-items-center">
                        <span>{p.productName}</span>
                        <span>${p.price} (Qty: {p.quantity})</span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </Tab.Pane>

              <Tab.Pane eventKey="orders">
                <h5 className="mb-3">My Orders</h5>
                {orders.length === 0 ? <p>No orders placed yet.</p> : (
                  <ListGroup>
                    {orders.map(o => (
                      <ListGroup.Item key={o.orderId} className="d-flex justify-content-between align-items-center">
                        <span>Order #{o.orderId}</span>
                        <span>{o.status} — ${o.totalPrice}</span>
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
