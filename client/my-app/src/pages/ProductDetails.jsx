import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { getProductById } from "../services/products/api";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(productId)
        console.log(response)
        setProduct(response);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  console.log('Specific Product', product)

  if (loading) return <Spinner animation="border" className="mt-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!product) return <Alert variant="warning">Product not found.</Alert>;

  return (
    <div className="container mt-4">
      <Card>
        <Card.Img
          variant="top"
          src={product.imageUrl || "https://via.placeholder.com/300"}
          alt={product.productName}
        />
        <Card.Body>
          <Card.Title>{product.productName}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text>
            <strong>Price:</strong> ${product.price}
          </Card.Text>
          <Card.Text>
            <strong>Stock:</strong> {product.quantity} left
          </Card.Text>
          <Card.Text>
            <strong>Category:</strong> {product.category}
          </Card.Text>
          <Card.Text>
            <strong>Seller ID:</strong> {product.sellerId}
          </Card.Text>
          <Button variant="primary" className="me-2">
            Add to Cart
          </Button>
          <Button variant="success">Buy Now</Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductDetails;
