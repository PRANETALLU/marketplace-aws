import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { getProducts } from "../services/products/api";
import { UserContext } from "../context/UserContext";

const PLACEHOLDER = "https://via.placeholder.com/300x200?text=No+Image";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");
  const { user } = useContext(UserContext);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filtered = products.filter((p) => {
    const matchSearch = p.productName?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-wrapper">
      <div className="page-container">
        {/* Page header */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
          <div>
            <h1 className="page-heading">Marketplace</h1>
            <p className="page-subheading">Discover {products.length} products from independent sellers</p>
          </div>
          {user && (
            <Link to="/dashboard" className="btn-primary-mp">+ Sell a Product</Link>
          )}
        </div>

        {/* Filters */}
        <div className="mp-card mb-4">
          <div className="mp-card-body d-flex gap-3 align-items-center flex-wrap" style={{ padding: "1rem 1.25rem" }}>
            <div style={{ flex: "1 1 220px", position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>🔍</span>
              <input
                className="mp-input"
                style={{ paddingLeft: "2.2rem" }}
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "0.4rem 1rem",
                    borderRadius: 999,
                    border: "1.5px solid",
                    borderColor: category === cat ? "var(--primary)" : "var(--border)",
                    background: category === cat ? "var(--primary)" : "var(--surface)",
                    color: category === cat ? "#fff" : "var(--text-muted)",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-sm-6 col-lg-4 col-xl-3">
                <div className="mp-card" style={{ overflow: "hidden" }}>
                  <div className="skeleton" style={{ height: 180 }} />
                  <div className="mp-card-body">
                    <div className="skeleton" style={{ height: 16, marginBottom: 8, borderRadius: 4 }} />
                    <div className="skeleton" style={{ height: 12, width: "60%", borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mp-card">
            <div className="empty-state">
              <div className="empty-state-icon">🛍️</div>
              <h4>{search || category !== "All" ? "No products match your filters" : "No products yet"}</h4>
              <p>{search || category !== "All" ? "Try adjusting your search or category." : "Be the first to list something!"}</p>
              {(search || category !== "All") && (
                <button className="btn-outline-mp" onClick={() => { setSearch(""); setCategory("All"); }}>Clear Filters</button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              Showing {filtered.length} of {products.length} products
            </div>
            <div className="row g-4">
              {filtered.map((product) => (
                <div key={product.productId} className="col-sm-6 col-lg-4 col-xl-3">
                  <div className="mp-card h-100 d-flex flex-column" style={{ overflow: "hidden", transition: "transform 0.2s, box-shadow 0.2s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-lg)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                  >
                    <div style={{ position: "relative", overflow: "hidden", height: 200, background: "var(--surface-2)" }}>
                      <img
                        src={product.imageUrl || PLACEHOLDER}
                        alt={product.productName}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                        onError={(e) => { e.target.src = PLACEHOLDER; }}
                      />
                      {product.category && (
                        <span className="badge-mp badge-primary" style={{ position: "absolute", top: 10, left: 10 }}>
                          {product.category}
                        </span>
                      )}
                    </div>
                    <div className="mp-card-body d-flex flex-column flex-grow-1">
                      <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)", marginBottom: "0.4rem", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {product.productName}
                      </h3>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
                        {product.description}
                      </p>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--primary)" }}>
                          ${Number(product.price).toFixed(2)}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {product.quantity > 0 ? `${product.quantity} in stock` : <span className="text-danger">Out of stock</span>}
                        </span>
                      </div>
                      <Link
                        to={`/product/${product.productId}`}
                        className="btn-primary-mp justify-content-center"
                        style={{ width: "100%" }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
