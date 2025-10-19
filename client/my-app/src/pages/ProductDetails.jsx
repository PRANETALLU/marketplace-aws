import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Spinner,
  Alert,
  Container,
  Row,
  Col,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { getProductById } from "../services/products/api";
import { getReviewsForProduct, createReviewForProduct } from "../services/reviews/api";
import { UserContext } from "../context/UserContext";

const ProductDetails = () => {
  const { productId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // fetch product & reviews
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(productId);
        const reviewsData = await getReviewsForProduct(productId);
        setProduct(productData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : reviewsData.reviews || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load product or reviews.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndReviews();
  }, [productId]);

  const isOwner = Boolean(user && product && user.sub === product.sellerId);

  const handleReviewSubmit = async () => {
    if (!rating) return alert("Please select a rating.");
    setSubmitting(true);
    try {
      const newReview = await createReviewForProduct({ productId, rating, comment });
      setReviews((prev) => [...prev, newReview || { 
        reviewId: Date.now().toString(), 
        rating, 
        comment, 
        buyerId: user?.sub, 
        createdAt: new Date().toISOString() 
      }]);
      setShowModal(false);
      setComment("");
      setRating(5);
      alert("✅ Review submitted!");
    } catch (err) {
      console.error("Review submission error:", err);
      alert("❌ Failed to submit review. You can only review products you've purchased.");
    } finally {
      setSubmitting(false);
    }
  };

  const formattedPrice = product?.price != null ? Number(product.price).toFixed(2) : "";

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "70vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;
  if (!product) return <Alert variant="warning" className="mt-4">Product not found.</Alert>;

  return (
    <Container className="py-5">
      {/* Product Details Section */}
      <Row className="g-5 mb-5">
        {/* Left: Image */}
        <Col xs={12} lg={6}>
          <Card className="shadow-sm border-0 overflow-hidden">
            <Card.Img
              variant="top"
              src={product.imageUrl || "https://via.placeholder.com/800x600"}
              alt={product.productName}
              style={{ 
                width: "100%", 
                height: "auto",
                maxHeight: "500px",
                objectFit: "contain",
                backgroundColor: "#f8f9fa"
              }}
            />
          </Card>
        </Col>

        {/* Right: Details */}
        <Col xs={12} lg={6}>
          <div className="h-100 d-flex flex-column">
            {/* Header */}
            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h1 className="h2 fw-bold mb-0">{product.productName}</h1>
                <Badge bg="info" pill className="px-3 py-2 text-uppercase">
                  {product.category}
                </Badge>
              </div>
              <p className="text-muted fs-6 mb-0">{product.description}</p>
            </div>

            {/* Price & Stock Info */}
            <div className="mb-4 pb-4 border-bottom">
              <h2 className="h3 text-primary fw-bold mb-3">${formattedPrice}</h2>
              <div className="d-flex flex-column gap-2">
                <p className="mb-0">
                  <strong>Stock Available:</strong>{" "}
                  <span className={product.quantity > 10 ? "text-success" : "text-warning"}>
                    {product.quantity} units
                  </span>
                </p>
                <p className="mb-0 text-muted">
                  <strong>Seller ID:</strong> {product.sellerId}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto">
              <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
                <Button 
                  variant="primary" 
                  size="lg" 
                  className="flex-grow-1"
                  disabled={product.quantity === 0}
                >
                  Add to Cart
                </Button>
                <Button 
                  variant="success" 
                  size="lg" 
                  className="flex-grow-1"
                  disabled={product.quantity === 0}
                >
                  Buy Now
                </Button>
              </div>
              
              <div className="d-flex flex-column flex-sm-row gap-3">
                {isOwner && (
                  <Button 
                    as={Link} 
                    to={`/edit-product/${productId}`} 
                    variant="outline-secondary" 
                    size="lg"
                    className="flex-grow-1"
                  >
                    Edit Product
                  </Button>
                )}
                {!isOwner && user && (
                  <Button 
                    variant="outline-dark" 
                    size="lg" 
                    onClick={() => setShowModal(true)}
                    className="flex-grow-1"
                  >
                    Write a Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Reviews Section */}
      <div className="mt-5 pt-4 border-top">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="h4 fw-bold mb-0">Customer Reviews</h3>
          <Badge bg="secondary" pill className="px-3 py-2">
            {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
          </Badge>
        </div>

        {reviews.length === 0 ? (
          <Card className="shadow-sm border-0 text-center py-5">
            <Card.Body>
              <div className="text-muted mb-3">
                <svg 
                  width="64" 
                  height="64" 
                  fill="currentColor" 
                  className="mb-3" 
                  viewBox="0 0 16 16"
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              </div>
              <h5 className="text-muted">No reviews yet</h5>
              <p className="text-muted mb-0">Be the first to review this product!</p>
            </Card.Body>
          </Card>
        ) : (
          <div className="d-flex flex-column gap-3">
            {reviews.map((review, idx) => (
              <Card 
                key={review.reviewId || `${productId}-rev-${idx}`} 
                className="shadow-sm border-0"
              >
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="text-warning fs-5 fw-bold">
                        {"★".repeat(review.rating)}
                        <span className="text-muted">{"☆".repeat(5 - review.rating)}</span>
                      </div>
                      <span className="text-muted">({review.rating}/5)</span>
                    </div>
                    {review.createdAt && (
                      <small className="text-muted">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </small>
                    )}
                  </div>
                  
                  {review.comment && (
                    <Card.Text className="mb-3">
                      {review.comment}
                    </Card.Text>
                  )}
                  
                  {review.buyerId && (
                    <Card.Subtitle className="text-muted small">
                      Reviewed by <strong>{review.buyerId}</strong>
                    </Card.Subtitle>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Write a Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reviewRating" className="mb-3">
              <Form.Label className="fw-semibold">Rating</Form.Label>
              <Form.Select 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                className="form-select-lg"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {"★".repeat(r)}{"☆".repeat(5 - r)} ({r} Star{r > 1 ? "s" : ""})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="reviewComment">
              <Form.Label className="fw-semibold">Your Review (optional)</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4} 
                value={comment} 
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReviewSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductDetails;