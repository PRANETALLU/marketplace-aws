import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get("/cart"); // Replace with your API endpoint
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.post("/cart", { productId, quantity });
      fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await axios.delete(`/cart/item/${productId}`);
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const getTotalPrice = () => {
    return cart?.items?.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

  return (
    <Container>
      <h2 className="my-4">Your Shopping Cart</h2>
      {cart.items.map((item) => (
        <Card key={item.productId} className="mb-3">
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5>{item.title || `Product #${item.productId}`}</h5>
                <p>${item.price.toFixed(2)}</p>
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.productId, parseInt(e.target.value))
                  }
                />
              </Col>
              <Col md={3} className="text-end">
                <Button
                  variant="danger"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  Remove
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
      <Card className="mt-4">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h5>Total: ${getTotalPrice().toFixed(2)}</h5>
          <Button variant="success">Proceed to Checkout</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Cart;
