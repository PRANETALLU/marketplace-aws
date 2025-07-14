import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getProducts } from '../services/products/api';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        //const token = localStorage.getItem("token");
        const data = await getProducts(); 
        setProducts(JSON.parse(data.body));
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  console.log('Products', products)

  return (
    <Container className="my-4">
      <h2 className="mb-4">Available Products</h2>
      <Row>
        {products.map(product => (
          <Col md={4} className="mb-4" key={product.productId}>
            <Card className="h-100">
              <Card.Img 
                variant="top" 
                src={product.imageUrl || "https://via.placeholder.com/300"} 
                alt={product.productName} 
              />
              <Card.Body>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>${product.price}</Card.Text>
                <Button as={Link} to={`/product/${product.productId}`} variant="primary">
                  View
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
