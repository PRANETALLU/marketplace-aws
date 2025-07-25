import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../services/carts/api";
import { getOrdersPlaced } from "../services/orders/api";
import { createReviewForProduct } from "../services/reviews/api"; // ✅

const ProductCard = ({ product }) => {
  const { user, loading } = useContext(UserContext);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();
  const isOwner = user?.sub === product?.sellerId;

  useEffect(() => {
    const checkIfPurchased = async () => {
      try {
        if (!user?.sub || isOwner) return;

        const orders = await getOrdersPlaced();
        const purchased = orders.some(
          (order) => order.productId === product.productId
        );
        setHasPurchased(purchased);
      } catch (error) {
        console.error("Error checking purchase history:", error);
      }
    };

    checkIfPurchased();
  }, [user, product.productId, isOwner]);

  const onAddToCart = async () => {
    try {
      const cartItemData = {
        productId: product.productId,
        quantity: 1,
      };

      await addToCart(cartItemData);
      alert(`✅ "${product.productName}" added to cart.`);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const onBuyNow = () => {
    navigate("/checkout", { state: { product, quantity: 1 } });
  };

  const handleReviewSubmit = async () => {
    try {
      const reviewData = {
        productId: product.productId,
        rating,
        comment,
      };

      const response = await createReviewForProduct(reviewData);
      alert("✅ Review submitted!");
      setShowModal(false);
      setRating(5);
      setComment("");
    } catch (err) {
      if (err.response?.status === 403) {
        alert("❌ You can only review products you’ve purchased.");
      } else {
        console.error("Review error:", err);
        alert("❌ Failed to submit review.");
      }
    }
  };

  return (
    <div className="border rounded p-3 shadow-sm bg-white h-100">
      <Card className="h-100 border-0">
        <Card.Img
          variant="top"
          src={product.imageUrl || "https://via.placeholder.com/300"}
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Card.Body>
          <Card.Title>{product.productName}</Card.Title>
          <Card.Text className="text-muted">{product.description}</Card.Text>
          <Card.Text>
            <strong>Price:</strong> ${product.price.toFixed(2)}
          </Card.Text>
          <Card.Text>
            <strong>In Stock:</strong> {product.quantity}
          </Card.Text>
          <Card.Text>
            <strong>Category:</strong> {product.category}
          </Card.Text>

          {!isOwner ? (
            <div className="d-flex justify-content-between mt-3">
              <Button variant="outline-primary" onClick={onAddToCart}>
                Add to Cart
              </Button>
              <Button variant="success" onClick={onBuyNow}>
                Buy Now
              </Button>
            </div>
          ) : (
            <div className="text-muted mt-3">
              You are the seller of this product.
            </div>
          )}

          <Button
            as={Link}
            to={`/product/${product.productId}`}
            variant="link"
            className="mt-2 p-0"
          >
            View Details
          </Button>

          {!isOwner && hasPurchased && (
            <Button
              variant="outline-secondary"
              size="sm"
              className="mt-2"
              onClick={() => setShowModal(true)}
            >
              Add Review
            </Button>
          )}
        </Card.Body>
      </Card>

      {/* ✅ Review Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review for {product.productName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="reviewRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                as="select"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star{r > 1 ? "s" : ""}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="reviewComment" className="mt-3">
              <Form.Label>Comment (optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReviewSubmit}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductCard;
