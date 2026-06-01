import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    console.log("Payment succeeded for order:", orderId);
  }, [orderId]);

  return (
    <div className="page-wrapper">
      <div className="page-container-sm">
        <div className="mp-card text-center" style={{ padding: "3.5rem 2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.5rem" }}>
            Payment Successful!
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            Thank you for your purchase. Your order has been placed.
          </p>
          {orderId && (
            <div style={{
              display: "inline-block",
              background: "var(--success-light)",
              color: "var(--success)",
              borderRadius: 10,
              padding: "0.5rem 1.25rem",
              fontWeight: 700,
              fontSize: "0.875rem",
              marginBottom: "2rem",
            }}>
              Order ID: {orderId}
            </div>
          )}
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/orders" className="btn-primary-mp">View My Orders</Link>
            <Link to="/home" className="btn-outline-mp">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
