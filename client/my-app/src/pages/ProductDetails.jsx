import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import { getProductById } from "../services/products/api";
import { UserContext } from "../context/UserContext";
import { getReviewsForProduct } from "../services/reviews/api";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      try {
        const response = await getProductById(productId);
        setProduct(response);

        const reviewsRes = await getReviewsForProduct(productId);
        setReviews(reviewsRes);
      } catch (err) {
        console.error(err);
        setError("Failed to load product or reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId]);

  const isOwner = user?.sub === product?.sellerId;

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

      {/* Reviews Section */}
      <div className="mt-5">
        <h4>Customer Reviews</h4>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <Card key={review.reviewId} className="my-3">
              <Card.Body>
                <Card.Title>Rating: {review.rating} / 5</Card.Title>
                <Card.Text>{review.comment}</Card.Text>
                <Card.Subtitle className="text-muted" style={{ fontSize: '0.85rem' }}>
                  Reviewed by {review.buyerId} on {new Date(review.createdAt).toLocaleString()}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
