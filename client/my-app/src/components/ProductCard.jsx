import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { addToCart } from "../services/carts/api";

const ProductCard = ({ product }) => {

  const { user, loading } = useContext(UserContext);

  const onAddToCart = async (product) => {
    try {
      const cartItemData = {
        productId: product.productId,
        qty: 1, // default to 1 for now, can be made dynamic later
      };

      const result = await addToCart(cartItemData);
      console.log("Cart add result:", result);
      alert(`✅ "${product.productName}" added to cart.`);
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      alert("Failed to add product to cart. Please try again.");
    }
  };


  const onBuyNow = (product) => {
    console.log("Buying now:", product);
    alert(`Proceeding to buy "${product.productName}".`);
  };

  const isOwner = user.sub === product.sellerId;

  console.log('User Product Card', user);
  console.log('Seller Product Card', product.sellerId);

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
              <Button
                variant="outline-primary"
                onClick={() => onAddToCart(product)}
              >
                Add to Cart
              </Button>
              <Button variant="success" onClick={() => onBuyNow(product)}>
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
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProductCard;
