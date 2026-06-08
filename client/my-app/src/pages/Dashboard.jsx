import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getProductsBySeller, deleteProduct } from "../services/products/api";
import { getOrdersPlaced, getOrdersReceived, updateOrderStatus } from "../services/orders/api";
import { getUserTransactions } from "../services/transactions/api";
import CreateProductForm from "../components/CreateProductForm";

const STATUS_BADGE = {
  pending:    "badge-warning",
  confirmed:  "badge-info",
  shipped:    "badge-primary",
  delivered:  "badge-success",
  cancelled:  "badge-danger",
  available:  "badge-success",
};

const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const Dashboard = () => {
  const { user, loading: userLoading } = useContext(UserContext);

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts]   = useState([]);
  const [orders, setOrders]       = useState([]);
  const [received, setReceived]   = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loadingProducts, setLoadingProducts]         = useState(false);
  const [loadingOrders, setLoadingOrders]             = useState(false);
  const [loadingReceived, setLoadingReceived]         = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [deletingId, setDeletingId]     = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchProducts();
  }, [user]);

  useEffect(() => {
    if (!user || activeTab !== "orders") return;
    fetchOrders();
  }, [user, activeTab]);

  useEffect(() => {
    if (!user || activeTab !== "received") return;
    fetchReceived();
  }, [user, activeTab]);

  useEffect(() => {
    if (!user || activeTab !== "transactions") return;
    fetchTransactions();
  }, [user, activeTab]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try { setProducts(await getProductsBySeller()); }
    catch {}
    finally { setLoadingProducts(false); }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try { setOrders(await getOrdersPlaced()); }
    catch {}
    finally { setLoadingOrders(false); }
  };

  const fetchReceived = async () => {
    setLoadingReceived(true);
    try { setReceived(await getOrdersReceived()); }
    catch {}
    finally { setLoadingReceived(false); }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try { setTransactions(await getUserTransactions()); }
    catch {}
    finally { setLoadingTransactions(false); }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.productId !== productId));
    } catch {}
    finally { setDeletingId(null); }
  };

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, { status });
      setReceived((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status } : o));
    } catch {}
    finally { setUpdatingOrderId(null); }
  };

  if (userLoading) {
    return (
      <div className="page-wrapper">
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-wrapper">
        <div className="page-container-sm">
          <div className="mp-card">
            <div className="empty-state">
              <div className="empty-state-icon">🔐</div>
              <h4>Login required</h4>
              <p>Please log in to view your dashboard.</p>
              <Link to="/login" className="btn-primary-mp">Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const TABS = [
    { key: "profile",      label: "Profile" },
    { key: "products",     label: "My Listings" },
    { key: "orders",       label: "My Orders" },
    { key: "received",     label: "Orders Received" },
    { key: "transactions", label: "Transactions" },
  ];

  return (
    <div className="page-wrapper">
      <div className="page-container">
        {/* Header */}
        <div className="mp-card mb-4">
          <div className="mp-card-body d-flex align-items-center gap-4 flex-wrap">
            <div style={{
              width: 64, height: 64,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "1.5rem", fontWeight: 800, flexShrink: 0,
            }}>
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: 0, fontWeight: 800, fontSize: "1.4rem" }}>{user.username}</h2>
              <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>{user.email}</div>
            </div>
            <div className="ms-auto d-flex gap-3 flex-wrap">
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)" }}>{products.length}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>LISTINGS</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontWeight: 800, fontSize: "1.5rem", color: "var(--primary)" }}>{orders.length || "—"}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>ORDERS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1.5rem", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "0.35rem", overflowX: "auto" }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: "0 0 auto",
                background: activeTab === tab.key ? "var(--primary)" : "transparent",
                color: activeTab === tab.key ? "#fff" : "var(--text-muted)",
                border: "none",
                borderRadius: "10px",
                padding: "0.55rem 1.1rem",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="mp-card" style={{ animation: "fadeInUp 0.3s ease" }}>
            <div className="mp-card-body">
              <h5 className="section-title">Profile Information</h5>
              <div className="row g-3">
                {[
                  ["Username", user.username],
                  ["Email", user.email],
                  ["User ID", user.sub],
                  ["Email Verified", user.emailVerified ? "Yes" : "No"],
                ].map(([label, val]) => (
                  <div key={label} className="col-sm-6">
                    <div style={{ background: "var(--surface-2)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", border: "1px solid var(--border)" }}>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.25rem" }}>{label}</div>
                      <div style={{ fontWeight: 600, fontSize: "0.95rem", wordBreak: "break-all" }}>{val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Listings */}
        {activeTab === "products" && (
          <div style={{ animation: "fadeInUp 0.3s ease" }}>
            <div className="mp-card mb-4">
              <div className="mp-card-body">
                <h5 className="section-title">Create New Listing</h5>
                <CreateProductForm
                  onProductCreated={(p) => setProducts((prev) => [p, ...prev])}
                />
              </div>
            </div>

            <div className="mp-card">
              <div className="mp-card-body">
                <h5 className="section-title">
                  Your Listings
                  <span style={{ marginLeft: "0.5rem", background: "var(--primary-light)", color: "var(--primary)", borderRadius: 999, padding: "0.15rem 0.6rem", fontSize: "0.75rem", fontWeight: 700 }}>
                    {products.length}
                  </span>
                </h5>

                {loadingProducts ? (
                  <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="empty-state" style={{ padding: "2.5rem 1rem" }}>
                    <div className="empty-state-icon">📦</div>
                    <h4>No listings yet</h4>
                    <p>Use the form above to create your first product.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {products.map((p) => (
                      <div key={p.productId} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface-2)" }}>
                        <img
                          src={p.imageUrl || "https://via.placeholder.com/56"}
                          alt={p.productName}
                          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid var(--border)", flexShrink: 0 }}
                        />
                        <div className="flex-grow-1 min-w-0">
                          <div style={{ fontWeight: 700, fontSize: "0.95rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {p.productName}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                            {p.category} &nbsp;·&nbsp; Qty: {p.quantity}
                          </div>
                        </div>
                        <div style={{ fontWeight: 800, color: "var(--primary)", whiteSpace: "nowrap" }}>
                          ${Number(p.price).toFixed(2)}
                        </div>
                        <span className={`badge-mp ${STATUS_BADGE[p.status] || "badge-neutral"}`}>
                          {p.status}
                        </span>
                        <div className="d-flex gap-2">
                          <Link to={`/product/${p.productId}`} className="btn-outline-mp" style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}>
                            View
                          </Link>
                          <button
                            className="btn-danger-mp"
                            style={{ padding: "0.35rem 0.75rem", fontSize: "0.8rem" }}
                            onClick={() => handleDelete(p.productId)}
                            disabled={deletingId === p.productId}
                          >
                            {deletingId === p.productId ? "..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* My Orders (buyer) */}
        {activeTab === "orders" && (
          <div className="mp-card" style={{ animation: "fadeInUp 0.3s ease" }}>
            <div className="mp-card-body">
              <h5 className="section-title">My Orders</h5>
              {loadingOrders ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : orders.length === 0 ? (
                <div className="empty-state" style={{ padding: "2.5rem 1rem" }}>
                  <div className="empty-state-icon">🛒</div>
                  <h4>No orders yet</h4>
                  <p>Your purchase history will appear here.</p>
                  <Link to="/home" className="btn-primary-mp">Browse Products</Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {orders.map((o) => (
                    <div key={o.orderId} style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface-2)" }}>
                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                            Order #{o.orderId?.slice(-8).toUpperCase()}
                          </div>
                          {o.createdAt && (
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              {new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </div>
                          )}
                          {Array.isArray(o.items) && o.items.length > 0 && (
                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>
                              {o.items.map((item, i) => (
                                <span key={i}>
                                  {item.productId?.slice(-6).toUpperCase()} × {item.quantity}
                                  {i < o.items.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          {o.status && <span className={`badge-mp ${STATUS_BADGE[o.status] || "badge-neutral"}`}>{o.status}</span>}
                          {(o.totalAmount != null || o.totalPrice != null) && (
                            <span style={{ fontWeight: 800, color: "var(--primary)" }}>
                              ${Number(o.totalAmount ?? o.totalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Orders Received (seller) */}
        {activeTab === "received" && (
          <div className="mp-card" style={{ animation: "fadeInUp 0.3s ease" }}>
            <div className="mp-card-body">
              <h5 className="section-title">Orders Received</h5>
              {loadingReceived ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : received.length === 0 ? (
                <div className="empty-state" style={{ padding: "2.5rem 1rem" }}>
                  <div className="empty-state-icon">📬</div>
                  <h4>No incoming orders</h4>
                  <p>When buyers purchase your products, orders appear here.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {received.map((o) => (
                    <div key={o.orderId} style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface-2)" }}>
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                            Order #{o.orderId?.slice(-8).toUpperCase()}
                          </div>
                          {o.createdAt && (
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              {new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </div>
                          )}
                          {/* Items list (new schema) */}
                          {Array.isArray(o.items) && o.items.length > 0 && (
                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>
                              {o.items.map((item, i) => (
                                <span key={i}>
                                  {item.productId?.slice(-6).toUpperCase()} × {item.quantity}
                                  {i < o.items.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          )}
                          {/* Fallback: legacy single-item schema */}
                          {!Array.isArray(o.items) && o.productName && (
                            <div style={{ fontSize: "0.85rem", marginTop: 4 }}>{o.productName}</div>
                          )}
                          {o.buyerEmail && (
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                              Buyer: {o.buyerEmail}
                            </div>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          <span className={`badge-mp ${STATUS_BADGE[o.status] || "badge-neutral"}`}>{o.status || "pending"}</span>
                          {/* Support both totalAmount (new) and totalPrice (legacy) */}
                          {(o.totalAmount != null || o.totalPrice != null) && (
                            <span style={{ fontWeight: 800, color: "var(--primary)" }}>
                              ${Number(o.totalAmount ?? o.totalPrice).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ marginTop: "0.75rem" }}>
                        <label className="mp-label" style={{ marginBottom: "0.35rem" }}>Update Status</label>
                        <div className="d-flex gap-2 flex-wrap">
                          {ORDER_STATUSES.map((s) => (
                            <button
                              key={s}
                              className={o.status === s ? "btn-primary-mp" : "btn-outline-mp"}
                              style={{ padding: "0.3rem 0.75rem", fontSize: "0.78rem" }}
                              disabled={updatingOrderId === o.orderId}
                              onClick={() => handleStatusUpdate(o.orderId, s)}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions */}
        {activeTab === "transactions" && (
          <div className="mp-card" style={{ animation: "fadeInUp 0.3s ease" }}>
            <div className="mp-card-body">
              <h5 className="section-title">Transaction History</h5>
              {loadingTransactions ? (
                <div className="d-flex justify-content-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </div>
              ) : transactions.length === 0 ? (
                <div className="empty-state" style={{ padding: "2.5rem 1rem" }}>
                  <div className="empty-state-icon">💳</div>
                  <h4>No transactions</h4>
                  <p>Completed Stripe payments will appear here.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {transactions.map((t) => (
                    <div key={t.transactionId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", border: "1px solid var(--border)", borderRadius: "var(--radius)", background: "var(--surface-2)", flexWrap: "wrap", gap: "0.75rem" }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                          #{t.transactionId?.slice(-8).toUpperCase()}
                        </div>
                        {t.createdAt && (
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            {new Date(t.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                          </div>
                        )}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {t.status && <span className={`badge-mp ${STATUS_BADGE[t.status] || "badge-neutral"}`}>{t.status}</span>}
                        {t.amount != null && (
                          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--success)" }}>
                            ${Number(t.amount).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
