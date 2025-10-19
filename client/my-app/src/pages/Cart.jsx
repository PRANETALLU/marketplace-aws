import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form, Spinner } from "react-bootstrap";
import { getCartItems, addToCart, removeCartItem } from "../services/carts/api";
import { getProductById } from "../services/products/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const cart = await getCartItems();
      setCartItems(cart.items || []);

      const productMap = {};
      await Promise.all(cart.items.map(async (item) => {
        const product = await getProductById(item.productId);
        productMap[item.productId] = product;
      }));
      setProductDetails(productMap);
    } catch (error) {
      console.error(error);
    } finally { setLoading(false); }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    await addToCart({ productId, qty: quantity });
    fetchCart();
  };

  const handleRemoveItem = async (productId) => {
    await removeCartItem(productId);
    fetchCart();
  };

  const getTotalPrice = () => cartItems.reduce((acc, item) => {
    const product = productDetails[item.productId];
    return acc + (product?.price || 0) * item.quantity;
  }, 0);

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (!cartItems.length) return <p className="text-center mt-5">Your cart is empty.</p>;

  return (
    <Container className="my-5">
      <h2 className="mb-4">Shopping Cart</h2>
      {cartItems.map((item) => {
        const product = productDetails[item.productId];
        if (!product) return null;
        return (
          <Card key={item.productId} className="mb-3 shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}><h5>{product.productName}</h5><p>${product.price}</p></Col>
                <Col md={3}>
                  <Form.Control
                    type="number" min="1" value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value))}
                  />
                </Col>
                <Col md={3} className="text-end">
                  <Button variant="danger" onClick={() => handleRemoveItem(item.productId)}>Remove</Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        );
      })}
      <Card className="mt-4 shadow-sm">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <h5>Total: ${getTotalPrice().toFixed(2)}</h5>
          <Button variant="success">Proceed to Checkout</Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Cart;
