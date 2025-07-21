import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { getCartItems, addToCart, removeCartItem } from "../services/carts/api";
import { getProductById } from "../services/products/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cart = await getCartItems();
      setCartItems(cart.items || []);

      // Fetch product details in parallel
      const productMap = {};
      await Promise.all(
        cart.items.map(async (item) => {
          const product = await getProductById(item.productId);
          productMap[item.productId] = product;
        })
      );
      setProductDetails(productMap);
    } catch (error) {
      console.error("Failed to fetch cart or product info:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await addToCart({ productId, qty: quantity }); // API expects { productId, qty }
      fetchCart();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeCartItem(productId);
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((acc, item) => {
      const product = productDetails[item.productId];
      return acc + (product?.price || 0) * item.quantity;
    }, 0);
  };

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (!cartItems.length) return <p>Your cart is empty.</p>;

  return (
    <Container>
      <h2 className="my-4">Your Shopping Cart</h2>
      {cartItems.map((item) => {
        const product = productDetails[item.productId];
        if (!product) return null;

        return (
          <Card key={item.productId} className="mb-3">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>{product.productName}</h5>
                  <p>${product.price.toFixed(2)}</p>
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
        );
      })}
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
