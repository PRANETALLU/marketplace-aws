import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getProducts } from '../services/products/api';
import { UserContext } from "../context/UserContext";
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
   const { user } = useContext(UserContext);

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

  console.log('Home Products', products)

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Available Products</h2>
        {user && (
          <Button as={Link} to="/dashboard" variant="secondary">
            Go to Dashboard
          </Button>
        )}
      </div>
      <Row>
        {products.map(product => (
          <Col md={4} className="mb-4" key={product.productId}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
