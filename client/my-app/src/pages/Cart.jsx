import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCartItems, removeCartItem, updateCartItem } from "../services/carts/api";
import { getProductById } from "../services/products/api";
import { checkoutCartItems } from "../services/payments/api";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cart = await getCartItems();
      const items = cart?.items || [];
      setCartItems(items);
      const map = {};
      await Promise.all(
        items.map(async (item) => {
          try {
            map[item.productId] = await getProductById(item.productId);
          } catch {}
        })
      );
      setProductDetails(map);
    } catch (err) {
      setError("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = async (productId, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem(productId, { quantity: qty });
      fetchCart();
    } catch {}
  };

  const handleRemove = async (productId) => {
    try {
      await removeCartItem(productId);
      fetchCart();
    } catch {}
  };

  const getTotal = () =>
    cartItems.reduce((acc, item) => {
      const p = productDetails[item.productId];
      return acc + (p?.price || 0) * item.quantity;
    }, 0);

  const handleStripeCheckout = async () => {
    setCheckingOut(true);
    setError("");
    try {
      const payload = cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity }));
      const { url } = await checkoutCartItems(payload);
      window.location.href = url;
    } catch (err) {
      setError("Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-container">
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="mb-4">
          <h1 className="page-heading">Shopping Cart</h1>
          <p className="page-subheading">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</p>
        </div>

        {error && (
          <div className="mp-card mb-3" style={{ border: "1.5px solid #fca5a5", background: "#fef2f2", padding: "1rem 1.25rem", borderRadius: "12px", color: "#dc2626", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        {cartItems.length === 0 ? (
          <div className="mp-card">
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <h4>Your cart is empty</h4>
              <p>Browse the marketplace and add something you like.</p>
              <Link to="/home" className="btn-primary-mp">Browse Products</Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => {
                  const product = productDetails[item.productId];
                  if (!product) return null;
                  const subtotal = (product.price * item.quantity).toFixed(2);
                  return (
                    <div key={item.productId} className="mp-card">
                      <div className="mp-card-body">
                        <div className="d-flex gap-3 align-items-start">
                          <img
                            src={product.imageUrl || "https://via.placeholder.com/80"}
                            alt={product.productName}
                            style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "1px solid var(--border)", flexShrink: 0 }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <Link
                                  to={`/product/${item.productId}`}
                                  style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", textDecoration: "none" }}
                                >
                                  {product.productName}
                                </Link>
                                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                                  {product.category}
                                </div>
                              </div>
                              <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "var(--primary)", whiteSpace: "nowrap" }}>
                                ${subtotal}
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 mt-3">
                              <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                                ${product.price.toFixed(2)} each
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <button
                                  className="btn-ghost-mp"
                                  style={{ padding: "0.25rem 0.5rem", border: "1px solid var(--border)", borderRadius: 8, lineHeight: 1 }}
                                  onClick={() => handleQtyChange(item.productId, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >−</button>
                                <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.quantity}</span>
                                <button
                                  className="btn-ghost-mp"
                                  style={{ padding: "0.25rem 0.5rem", border: "1px solid var(--border)", borderRadius: 8, lineHeight: 1 }}
                                  onClick={() => handleQtyChange(item.productId, item.quantity + 1)}
                                >+</button>
                              </div>
                              <button
                                className="btn-ghost-mp text-danger"
                                style={{ marginLeft: "auto", fontSize: "0.8rem" }}
                                onClick={() => handleRemove(item.productId)}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="col-lg-4">
              <div className="mp-card" style={{ position: "sticky", top: "80px" }}>
                <div className="mp-card-body">
                  <h5 className="section-title">Order Summary</h5>

                  <div className="d-flex flex-column gap-2 mb-3">
                    {cartItems.map((item) => {
                      const p = productDetails[item.productId];
                      if (!p) return null;
                      return (
                        <div key={item.productId} className="d-flex justify-content-between" style={{ fontSize: "0.875rem" }}>
                          <span className="text-muted">{p.productName} × {item.quantity}</span>
                          <span>${(p.price * item.quantity).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>

                  <hr className="mp-divider" />

                  <div className="d-flex justify-content-between mb-4">
                    <span style={{ fontWeight: 700, fontSize: "1rem" }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)" }}>
                      ${getTotal().toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="btn-primary-mp w-100 justify-content-center"
                    onClick={handleStripeCheckout}
                    disabled={checkingOut}
                    style={{ padding: "0.8rem" }}
                  >
                    {checkingOut ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" />
                        Redirecting...
                      </>
                    ) : (
                      "Checkout with Stripe"
                    )}
                  </button>

                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.75rem" }}>
                    Secure payment powered by Stripe
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
