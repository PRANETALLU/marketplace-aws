import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { checkoutSingleItem } from "../services/payments/api";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const initialQty = location.state?.quantity || 1;

  const [quantity, setQuantity] = useState(initialQty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!product) {
    return (
      <div className="page-wrapper">
        <div className="page-container-sm">
          <div className="mp-card">
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h4>No product selected</h4>
              <p>Please choose a product from the marketplace first.</p>
              <Link to="/home" className="btn-primary-mp">Browse Products</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = (product.price * quantity).toFixed(2);

  const handleCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const { url } = await checkoutSingleItem(product.productId, quantity);
      window.location.href = url;
    } catch (err) {
      setError("Failed to start checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-container-sm">
        <div className="mb-4">
          <button className="btn-ghost-mp" onClick={() => navigate(-1)} style={{ marginBottom: "0.5rem" }}>
            ← Back
          </button>
          <h1 className="page-heading">Checkout</h1>
          <p className="page-subheading">Review your order before payment</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "0.875rem 1.25rem", color: "#dc2626", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
            {error}
          </div>
        )}

        <div className="row g-4">
          <div className="col-md-7">
            <div className="mp-card">
              <div className="mp-card-body">
                <h5 className="section-title">Product</h5>
                <div className="d-flex gap-3 align-items-start">
                  <img
                    src={product.imageUrl || "https://via.placeholder.com/96"}
                    alt={product.productName}
                    style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)", flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", marginBottom: 4 }}>
                      {product.productName}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: 8 }}>
                      {product.description}
                    </div>
                    <span className="badge-mp badge-primary">{product.category}</span>
                  </div>
                </div>

                <hr className="mp-divider" />

                <div>
                  <label className="mp-label">Quantity</label>
                  <div className="d-flex align-items-center gap-3">
                    <button
                      className="btn-ghost-mp"
                      style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "0.3rem 0.6rem" }}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >−</button>
                    <span style={{ fontWeight: 700, fontSize: "1.1rem", minWidth: 32, textAlign: "center" }}>{quantity}</span>
                    <button
                      className="btn-ghost-mp"
                      style={{ border: "1px solid var(--border)", borderRadius: 8, padding: "0.3rem 0.6rem" }}
                      onClick={() => setQuantity((q) => Math.min(product.quantity, q + 1))}
                    >+</button>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      {product.quantity} in stock
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <div className="mp-card" style={{ position: "sticky", top: 80 }}>
              <div className="mp-card-body">
                <h5 className="section-title">Order Total</h5>

                <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.875rem" }}>
                  <span className="text-muted">Unit price</span>
                  <span>${product.price.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2" style={{ fontSize: "0.875rem" }}>
                  <span className="text-muted">Quantity</span>
                  <span>{quantity}</span>
                </div>

                <hr className="mp-divider" />

                <div className="d-flex justify-content-between mb-4">
                  <span style={{ fontWeight: 700 }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--primary)" }}>${subtotal}</span>
                </div>

                <button
                  className="btn-primary-mp w-100 justify-content-center"
                  onClick={handleCheckout}
                  disabled={loading || product.quantity === 0}
                  style={{ padding: "0.85rem" }}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status" />Redirecting to Stripe...</>
                  ) : product.quantity === 0 ? "Out of Stock" : "Pay with Stripe"}
                </button>

                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.75rem" }}>
                  🔒 Secure checkout via Stripe
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
