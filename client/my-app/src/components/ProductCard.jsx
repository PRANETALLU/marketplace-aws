import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const onAddToCart = (product) => {
    console.log("Added to cart:", product);
    alert(`"${product.productName}" added to cart.`);
  };

  const onBuyNow = (product) => {
    console.log("Buying now:", product);
    alert(`Proceeding to buy "${product.productName}".`);
  };

  return (
    <div className="border rounded p-3 shadow-sm bg-white h-100">
      <Card className="h-100 border-0">
        <Card.Img
          variant="top"
          src={product.imageUrl || "https://via.placeholder.com/300"}
          //alt={product.productName}
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
