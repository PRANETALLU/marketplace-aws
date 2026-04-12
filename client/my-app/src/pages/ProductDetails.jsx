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
      <div className="product-loading">
        <Spinner animation="border" style={{ color: '#0d6efd', width: '3rem', height: '3rem' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-loading">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-loading">
        <div className="error-state">
          <div className="error-icon">🔍</div>
          <p>Product not found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .product-details-wrapper {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(-45deg, #0d6efd, #0a58ca, #3b82f6, #60a5fa);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          padding: 6rem 0 3rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
        }

        .product-details-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s ease-in-out infinite;
          z-index: 0;
        }

        .product-details-container {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .product-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(-45deg, #0d6efd, #0a58ca, #3b82f6, #60a5fa);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        .error-state {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .error-state p {
          color: #64748b;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .modern-product-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: fadeInUp 0.6s ease-out;
        }

        .product-image-section {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(10, 88, 202, 0.05) 100%);
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 500px;
        }

        .product-image-section img {
          max-width: 100%;
          height: auto;
          max-height: 500px;
          object-fit: contain;
          border-radius: 16px;
          transition: transform 0.3s ease;
        }

        .product-image-section img:hover {
          transform: scale(1.02);
        }

        .product-info-section {
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product-header {
          margin-bottom: 2rem;
          animation: fadeInUp 0.7s ease-out;
        }

        .product-name {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .product-category-badge {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #0a58ca;
          border-radius: 12px;
          padding: 0.5rem 1.5rem;
          font-weight: 700;
          display: inline-block;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .product-description {
          color: #64748b;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-top: 1rem;
        }

        .product-price-section {
          padding: 1.5rem 0;
          border-bottom: 2px solid rgba(100, 116, 139, 0.2);
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .product-price {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .stock-info {
          color: #64748b;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .stock-available {
          font-weight: 700;
          color: #16a34a;
        }

        .stock-low {
          font-weight: 700;
          color: #ea580c;
        }

        .modern-action-btn {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-weight: 700;
          font-size: 1.1rem;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
          text-decoration: none;
          display: inline-block;
          text-align: center;
        }

        .modern-action-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(13, 110, 253, 0.5);
          background: linear-gradient(135deg, #0b5ed7 0%, #084298 100%);
          color: white;
        }

        .modern-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modern-action-btn.secondary {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4);
        }

        .modern-action-btn.secondary:hover:not(:disabled) {
          background: linear-gradient(135deg, #15803d 0%, #166534 100%);
          box-shadow: 0 12px 30px rgba(22, 163, 74, 0.5);
        }

        .modern-action-btn.outline {
          background: transparent;
          border: 2px solid #0d6efd;
          color: #0d6efd;
          box-shadow: 0 5px 15px rgba(13, 110, 253, 0.2);
        }

        .modern-action-btn.outline:hover {
          background: #0d6efd;
          color: white;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
        }

        .reviews-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2.5rem;
          margin-top: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.9s ease-out;
        }

        .reviews-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .reviews-title {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .reviews-count-badge {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #0a58ca;
          border-radius: 12px;
          padding: 0.5rem 1.5rem;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .review-card {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(10, 88, 202, 0.05) 100%);
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .review-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.15);
          border-color: #0d6efd;
        }

        .review-rating {
          color: #fbbf24;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .review-date {
          color: #64748b;
          font-size: 0.875rem;
        }

        .review-comment {
          color: #1e293b;
          font-size: 1rem;
          line-height: 1.6;
          margin: 1rem 0;
        }

        .review-author {
          color: #64748b;
          font-size: 0.875rem;
        }

        .empty-reviews {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-reviews-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-reviews-text {
          color: #64748b;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .modern-modal .modal-content {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modern-modal .modal-header {
          border-bottom: 2px solid rgba(100, 116, 139, 0.2);
          padding: 1.5rem 2rem;
        }

        .modern-modal .modal-title {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .modern-modal .modal-body {
          padding: 2rem;
        }

        .modern-modal .modal-footer {
          border-top: 2px solid rgba(100, 116, 139, 0.2);
          padding: 1.5rem 2rem;
        }

        .modern-form-label {
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .modern-form-control {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .modern-form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.1);
          outline: none;
        }

        @media (max-width: 992px) {
          .product-name {
            font-size: 2rem;
          }

          .product-price {
            font-size: 2.5rem;
          }

          .product-info-section {
            padding: 2rem;
          }

          .reviews-section {
            padding: 2rem;
          }
        }

        @media (max-width: 768px) {
          .product-name {
            font-size: 1.75rem;
          }

          .product-image-section {
            min-height: 300px;
            padding: 1.5rem;
          }

          .product-info-section {
            padding: 1.5rem;
          }

          .reviews-section {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="product-details-wrapper">
        <div className="product-details-container">
          {/* Product Details Section */}
          <Row className="g-4 mb-4">
            {/* Left: Image */}
            <Col xs={12} lg={6}>
              <div className="modern-product-card">
                <div className="product-image-section">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/800x600"}
                    alt={product.productName}
                  />
                </div>
              </div>
            </Col>

            {/* Right: Details */}
            <Col xs={12} lg={6}>
              <div className="modern-product-card">
                <div className="product-info-section">
                  {/* Header */}
                  <div className="product-header">
                    <h1 className="product-name">{product.productName}</h1>
                    <span className="product-category-badge">{product.category}</span>
                    <p className="product-description">{product.description}</p>
                  </div>

                  {/* Price & Stock Info */}
                  <div className="product-price-section">
                    <div className="product-price">${formattedPrice}</div>
                    <div className="stock-info">
                      <strong>Stock Available:</strong>{" "}
                      <span className={product.quantity > 10 ? "stock-available" : "stock-low"}>
                        {product.quantity} units
                      </span>
                    </div>
                    <div className="stock-info">
                      <strong>Seller ID:</strong> {product.sellerId}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto">
                    <div className="d-flex flex-column flex-sm-row gap-3 mb-3">
                      <button 
                        className="modern-action-btn flex-grow-1"
                        disabled={product.quantity === 0}
                      >
                        Add to Cart
                      </button>
                      <button 
                        className="modern-action-btn secondary flex-grow-1"
                        disabled={product.quantity === 0}
                      >
                        Buy Now
                      </button>
                    </div>
                    
                    <div className="d-flex flex-column flex-sm-row gap-3">
                      {isOwner && (
                        <Link 
                          to={`/edit-product/${productId}`} 
                          className="modern-action-btn outline flex-grow-1"
                        >
                          Edit Product
                        </Link>
                      )}
                      {!isOwner && user && (
                        <button 
                          className="modern-action-btn outline flex-grow-1"
                          onClick={() => setShowModal(true)}
                        >
                          Write a Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h3 className="reviews-title">Customer Reviews</h3>
              <span className="reviews-count-badge">
                {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
              </span>
            </div>

            {reviews.length === 0 ? (
              <div className="empty-reviews">
                <div className="empty-reviews-icon">⭐</div>
                <h5 className="empty-reviews-text">No reviews yet</h5>
                <p className="text-muted">Be the first to review this product!</p>
              </div>
            ) : (
              <div className="d-flex flex-column">
                {reviews.map((review, idx) => (
                  <div 
                    key={review.reviewId || `${productId}-rev-${idx}`} 
                    className="review-card"
                  >
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="review-rating">
                          {"★".repeat(review.rating)}
                          <span style={{ color: '#cbd5e1' }}>{"☆".repeat(5 - review.rating)}</span>
                        </div>
                        <span className="text-muted">({review.rating}/5)</span>
                      </div>
                      {review.createdAt && (
                        <small className="review-date">
                          {new Date(review.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </small>
                      )}
                    </div>
                    
                    {review.comment && (
                      <p className="review-comment">{review.comment}</p>
                    )}
                    
                    {review.buyerId && (
                      <p className="review-author mb-0">
                        Reviewed by <strong>{review.buyerId}</strong>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Review Modal */}
          <Modal 
            show={showModal} 
            onHide={() => setShowModal(false)} 
            centered
            className="modern-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title>Write a Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="reviewRating" className="mb-3">
                  <Form.Label className="modern-form-label">Rating</Form.Label>
                  <Form.Select 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="modern-form-control"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {"★".repeat(r)}{"☆".repeat(5 - r)} ({r} Star{r > 1 ? "s" : ""})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group controlId="reviewComment">
                  <Form.Label className="modern-form-label">Your Review (optional)</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4} 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="modern-form-control"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <button 
                className="modern-action-btn outline" 
                onClick={() => setShowModal(false)}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                Cancel
              </button>
              <button 
                className="modern-action-btn" 
                onClick={handleReviewSubmit} 
                disabled={submitting}
                style={{ padding: '0.75rem 1.5rem' }}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;