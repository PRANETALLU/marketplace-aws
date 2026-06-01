import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrdersPlaced } from "../services/orders/api";

const STATUS_BADGE = {
  pending:    "badge-warning",
  confirmed:  "badge-info",
  shipped:    "badge-primary",
  delivered:  "badge-success",
  cancelled:  "badge-danger",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrdersPlaced()
      .then(setOrders)
      .catch(() => setError("Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

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
          <h1 className="page-heading">My Orders</h1>
          <p className="page-subheading">Track everything you've purchased</p>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 12, padding: "0.875rem 1.25rem", color: "#dc2626", marginBottom: "1.25rem" }}>
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="mp-card">
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h4>No orders yet</h4>
              <p>When you make a purchase it will appear here.</p>
              <Link to="/home" className="btn-primary-mp">Start Shopping</Link>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {orders.map((order) => (
              <div key={order.orderId} className="mp-card">
                <div className="mp-card-body">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>
                        Order #{order.orderId?.slice(-8).toUpperCase()}
                      </div>
                      {order.createdAt && (
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 2 }}>
                          {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                        </div>
                      )}
                    </div>
                    <div className="d-flex align-items-center gap-3">
                      {order.status && (
                        <span className={`badge-mp ${STATUS_BADGE[order.status] || "badge-neutral"}`}>
                          {order.status}
                        </span>
                      )}
                      {order.totalPrice != null && (
                        <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--primary)" }}>
                          ${Number(order.totalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {order.items?.length > 0 && (
                    <>
                      <hr className="mp-divider" style={{ margin: "1rem 0" }} />
                      <div className="d-flex flex-column gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="d-flex justify-content-between align-items-center" style={{ fontSize: "0.875rem" }}>
                            <span style={{ color: "var(--text)" }}>{item.productName || item.productId}</span>
                            <span className="text-muted">× {item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {order.productId && !order.items && (
                    <>
                      <hr className="mp-divider" style={{ margin: "1rem 0" }} />
                      <div className="d-flex justify-content-between" style={{ fontSize: "0.875rem" }}>
                        <Link to={`/product/${order.productId}`} style={{ color: "var(--primary)" }}>
                          View Product
                        </Link>
                        {order.quantity && <span className="text-muted">Qty: {order.quantity}</span>}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
