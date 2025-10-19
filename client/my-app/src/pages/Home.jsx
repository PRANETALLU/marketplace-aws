import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getProducts } from '../services/products/api';
import { UserContext } from "../context/UserContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(JSON.parse(data.body));
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  console.log('Home Products', products)
  console.log('Home User', user)

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Products</h2>
        {user && (
          <Button as={Link} to="/dashboard" variant="secondary">
            Go to Dashboard
          </Button>
        )}
      </div>
      <Row>
        {products.map((product) => (
          <Col md={4} lg={3} className="mb-4" key={product.productId}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Img
                variant="top"
                src={product.image || "https://via.placeholder.com/200"}
                className="p-3"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text className="text-muted mb-3">${product.price}</Card.Text>
                <Button as={Link} to={`/product/${product.productId}`} variant="primary" className="mt-auto">
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
