import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrdersPlaced } from "../services/orders/api";

const PaymentSuccess = () => {
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    // Poll briefly for the order — webhook may take a second or two
    let attempts = 0;
    const poll = async () => {
      try {
        const orders = await getOrdersPlaced();
        const match = orders.find((o) => o.stripeSessionId === sessionId);
        if (match) {
          setOrder(match);
        } else if (attempts < 5) {
          attempts++;
          setTimeout(poll, 1500);
        }
      } catch {
        // silently ignore — user can still navigate to /orders
      }
    };
    poll();
  }, [sessionId]);

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

          {order ? (
            <div style={{
              background: "var(--success-light)",
              color: "var(--success)",
              borderRadius: 10,
              padding: "0.75rem 1.25rem",
              fontWeight: 700,
              fontSize: "0.875rem",
              marginBottom: "2rem",
              display: "inline-block",
            }}>
              Order #{order.orderId} &mdash; ${Number(order.totalAmount).toFixed(2)}
            </div>
          ) : sessionId ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
              Your order is being confirmed&hellip;
            </p>
          ) : null}

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
