import { Link } from "react-router-dom";

const PaymentCancel = () => (
  <div className="page-wrapper">
    <div className="page-container-sm">
      <div className="mp-card text-center" style={{ padding: "3.5rem 2rem" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>😕</div>
        <h2 style={{ fontWeight: 800, fontSize: "1.75rem", color: "var(--text)", marginBottom: "0.5rem" }}>
          Payment Cancelled
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Your transaction was not completed. Nothing has been charged.
        </p>
        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Link to="/cart" className="btn-primary-mp">Back to Cart</Link>
          <Link to="/home" className="btn-outline-mp">Browse Products</Link>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentCancel;
