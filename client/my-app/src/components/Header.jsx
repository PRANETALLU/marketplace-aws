import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getCartItems } from "../services/carts/api";

const NAV_LINK_STYLE = ({ isActive }) => ({
  color: isActive ? "#fff" : "rgba(255,255,255,0.75)",
  fontWeight: isActive ? 700 : 500,
  fontSize: "0.9rem",
  textDecoration: "none",
  padding: "0.4rem 0.75rem",
  borderRadius: "8px",
  background: isActive ? "rgba(255,255,255,0.18)" : "transparent",
  transition: "all 0.15s",
  display: "inline-block",
});

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) { setCartCount(0); return; }
    getCartItems()
      .then((data) => {
        const items = data?.items || [];
        setCartCount(items.reduce((sum, i) => sum + (i.quantity || 1), 0));
      })
      .catch(() => {});
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const initial = user?.username?.charAt(0).toUpperCase() || "?";

  return (
    <>
      <style>{`
        .mp-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 64px;
          background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 60%, #3b82f6 100%);
          box-shadow: 0 2px 12px rgba(29,78,216,0.35);
          display: flex;
          align-items: center;
        }
        .mp-nav-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .mp-brand {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .mp-brand-icon {
          width: 36px;
          height: 36px;
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        .mp-brand-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.3px;
        }
        .mp-nav-links {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          flex: 1;
        }
        .mp-nav-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-left: auto;
        }
        .mp-cart-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: rgba(255,255,255,0.85);
          font-size: 0.9rem;
          font-weight: 500;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 0.4rem 0.85rem;
          text-decoration: none;
          transition: all 0.15s;
          cursor: pointer;
        }
        .mp-cart-btn:hover {
          background: rgba(255,255,255,0.22);
          color: #fff;
          text-decoration: none;
        }
        .mp-cart-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ef4444;
          color: #fff;
          font-size: 0.65rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #2563eb;
        }
        .mp-user-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 0.3rem 0.85rem 0.3rem 0.3rem;
        }
        .mp-avatar {
          width: 28px;
          height: 28px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.75rem;
          color: #1d4ed8;
        }
        .mp-username {
          color: #fff;
          font-size: 0.875rem;
          font-weight: 600;
        }
        .mp-logout-btn {
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.9);
          border-radius: 8px;
          padding: 0.4rem 0.85rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
        }
        .mp-logout-btn:hover {
          background: rgba(255,255,255,0.25);
          color: #fff;
        }
        .mp-auth-btn {
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.3);
          color: #fff;
          border-radius: 8px;
          padding: 0.4rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          text-decoration: none;
        }
        .mp-auth-btn:hover { background: rgba(255,255,255,0.25); color: #fff; text-decoration: none; }
        .mp-auth-btn.solid {
          background: #fff;
          color: #1d4ed8;
          border-color: #fff;
        }
        .mp-auth-btn.solid:hover { background: #e0e7ff; color: #1d4ed8; }
        .mp-hamburger {
          display: none;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          padding: 0.4rem 0.6rem;
          cursor: pointer;
          flex-direction: column;
          gap: 4px;
          margin-left: auto;
        }
        .mp-hamburger span {
          display: block;
          width: 20px;
          height: 2px;
          background: #fff;
          border-radius: 2px;
        }
        @media (max-width: 768px) {
          .mp-nav-links { display: none; }
          .mp-nav-right  { display: none; }
          .mp-hamburger  { display: flex; }
          .mp-mobile-menu {
            position: fixed;
            top: 64px;
            left: 0;
            right: 0;
            background: #1d4ed8;
            padding: 1rem 1.5rem;
            z-index: 999;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            border-top: 1px solid rgba(255,255,255,0.15);
            box-shadow: 0 8px 20px rgba(0,0,0,0.2);
            animation: fadeInUp 0.2s ease;
          }
          .mp-mobile-menu a, .mp-mobile-menu button {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>

      <nav className="mp-navbar">
        <div className="mp-nav-inner">
          <Link to={user ? "/home" : "/"} className="mp-brand">
            <div className="mp-brand-icon">🛍️</div>
            <span className="mp-brand-name">Tradenest</span>
          </Link>

          {user && (
            <div className="mp-nav-links">
              <NavLink to="/home" style={NAV_LINK_STYLE}>Browse</NavLink>
              <NavLink to="/orders" style={NAV_LINK_STYLE}>My Orders</NavLink>
              <NavLink to="/dashboard" style={NAV_LINK_STYLE}>Dashboard</NavLink>
            </div>
          )}

          <div className="mp-nav-right">
            {user ? (
              <>
                <Link to="/cart" className="mp-cart-btn">
                  🛒 Cart
                  {cartCount > 0 && <span className="mp-cart-badge">{cartCount}</span>}
                </Link>
                <div className="mp-user-chip">
                  <div className="mp-avatar">{initial}</div>
                  <span className="mp-username">{user.username}</span>
                </div>
                <button className="mp-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mp-auth-btn">Login</Link>
                <Link to="/signup" className="mp-auth-btn solid">Sign Up</Link>
              </>
            )}
          </div>

          <button className="mp-hamburger" onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mp-mobile-menu">
          {user ? (
            <>
              <NavLink to="/home" style={NAV_LINK_STYLE} onClick={() => setMenuOpen(false)}>Browse</NavLink>
              <NavLink to="/cart" style={NAV_LINK_STYLE} onClick={() => setMenuOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</NavLink>
              <NavLink to="/orders" style={NAV_LINK_STYLE} onClick={() => setMenuOpen(false)}>My Orders</NavLink>
              <NavLink to="/dashboard" style={NAV_LINK_STYLE} onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              <button className="mp-logout-btn" onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mp-auth-btn" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="mp-auth-btn solid" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
