import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🏪",
    title: "List & Sell",
    desc: "Create product listings with images, set your price, and start selling in minutes.",
  },
  {
    icon: "🔍",
    title: "Browse & Discover",
    desc: "Search and filter thousands of products across categories from independent sellers.",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "Powered by Stripe — industry-standard encrypted checkout for every transaction.",
  },
  {
    icon: "📦",
    title: "Order Tracking",
    desc: "Sellers update order status in real time. Buyers always know where their order stands.",
  },
  {
    icon: "⭐",
    title: "Reviews",
    desc: "Verified-purchase reviews build trust between buyers and sellers on the platform.",
  },
  {
    icon: "☁️",
    title: "Cloud-Native",
    desc: "Fully serverless on AWS — Lambda, DynamoDB, S3, and API Gateway under the hood.",
  },
];

const AWS_SERVICES = [
  {
    icon: "⚡",
    name: "AWS Lambda",
    category: "Compute",
    desc: "Every API endpoint runs as its own serverless function — no servers to manage, scales automatically.",
  },
  {
    icon: "🚪",
    name: "API Gateway",
    category: "API",
    desc: "Single entry point for all API calls. Routes requests to Lambda, enforces auth, and handles CORS.",
  },
  {
    icon: "🗄️",
    name: "DynamoDB",
    category: "Database",
    desc: "NoSQL database with 5 tables: Products, Carts, Orders, Transactions, and Reviews.",
  },
  {
    icon: "🪣",
    name: "S3",
    category: "Storage",
    desc: "Two buckets — one for product image uploads, one for hosting the built React frontend.",
  },
  {
    icon: "🌐",
    name: "CloudFront",
    category: "CDN",
    desc: "Serves the React app globally over HTTPS with edge caching and automatic cache invalidation on deploy.",
  },
  {
    icon: "🔑",
    name: "Cognito",
    category: "Auth",
    desc: "Manages user sign-up, login, and JWT tokens. API Gateway verifies every protected request automatically.",
  },
  {
    icon: "📧",
    name: "SES",
    category: "Email",
    desc: "Sends payment confirmation emails to buyers and sale notifications to sellers after checkout.",
  },
  {
    icon: "🏗️",
    name: "CloudFormation / SAM",
    category: "Infrastructure",
    desc: "All resources defined as code in template.yaml. One command deploys the entire stack.",
  },
];

const Welcome = () => {
  const env = import.meta.env.VITE_ENVIRONMENT;

  return (
    <>
      <style>{`
        .welcome-page {
          min-height: 100vh;
          background: var(--bg);
          padding-top: var(--navbar-height);
        }

        /* --- Hero --- */
        .hero {
          background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%);
          padding: 5rem 1.5rem 4.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 20% 50%, rgba(96,165,250,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.12) 0%, transparent 50%);
          pointer-events: none;
        }
        .hero-inner {
          position: relative;
          max-width: 720px;
          margin: 0 auto;
          animation: fadeInUp 0.55s ease both;
        }
        .hero-env-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          padding: 0.3rem 0.9rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 1.75rem;
        }
        .hero-env-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 6px #4ade80;
        }
        .hero-title {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -1px;
          margin-bottom: 1.25rem;
        }
        .hero-title span {
          color: #93c5fd;
        }
        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.75);
          line-height: 1.65;
          max-width: 520px;
          margin: 0 auto 2.25rem;
        }
        .hero-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .hero-btn-primary {
          background: #fff;
          color: #1d4ed8;
          border: none;
          border-radius: var(--radius);
          padding: 0.8rem 2rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2);
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .hero-btn-primary:hover {
          background: #e0e7ff;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
          color: #1d4ed8;
          text-decoration: none;
        }
        .hero-btn-secondary {
          background: rgba(255,255,255,0.1);
          color: #fff;
          border: 1.5px solid rgba(255,255,255,0.3);
          border-radius: var(--radius);
          padding: 0.8rem 2rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }
        .hero-btn-secondary:hover {
          background: rgba(255,255,255,0.2);
          color: #fff;
          text-decoration: none;
          transform: translateY(-2px);
        }

        /* --- Stats bar --- */
        .stats-bar {
          background: #fff;
          border-bottom: 1px solid var(--border);
          padding: 1.25rem 1.5rem;
        }
        .stats-inner {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .stat-item {
          text-align: center;
          padding: 0 2.5rem;
          border-right: 1px solid var(--border);
        }
        .stat-item:last-child { border-right: none; }
        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1.2;
        }
        .stat-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 0.2rem;
        }

        /* --- Features --- */
        .features-section {
          padding: 4rem 1.5rem;
          max-width: 1100px;
          margin: 0 auto;
        }
        .features-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .features-heading {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 800;
          color: var(--text);
          text-align: center;
          margin-bottom: 0.75rem;
          letter-spacing: -0.5px;
        }
        .features-subheading {
          color: var(--text-muted);
          text-align: center;
          font-size: 1rem;
          max-width: 500px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }
        .feature-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .feature-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-3px);
          border-color: var(--primary);
        }
        .feature-icon-wrap {
          width: 44px;
          height: 44px;
          background: var(--primary-light);
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }
        .feature-card h4 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text);
          margin: 0 0 0.4rem;
        }
        .feature-card p {
          font-size: 0.875rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* --- AWS section --- */
        .aws-section {
          padding: 4rem 1.5rem;
          background: var(--surface);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .aws-section-inner {
          max-width: 1100px;
          margin: 0 auto;
        }
        .aws-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background: #fff3e0;
          color: #e65100;
          border: 1px solid #ffcc80;
          border-radius: 999px;
          padding: 0.25rem 0.85rem;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          margin-bottom: 0.6rem;
        }
        .aws-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin-top: 2.5rem;
        }
        .aws-card {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
        }
        .aws-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
          border-color: #ff9900;
        }
        .aws-card-header {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .aws-icon {
          width: 36px;
          height: 36px;
          background: #fff3e0;
          border-radius: var(--radius);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          flex-shrink: 0;
        }
        .aws-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1.2;
        }
        .aws-category {
          font-size: 0.7rem;
          font-weight: 600;
          color: #e65100;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .aws-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* --- CTA strip --- */
        .cta-strip {
          background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
          padding: 3.5rem 1.5rem;
          text-align: center;
        }
        .cta-strip h2 {
          font-size: clamp(1.4rem, 3vw, 1.9rem);
          font-weight: 800;
          color: #fff;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }
        .cta-strip p {
          color: rgba(255,255,255,0.72);
          font-size: 1rem;
          margin-bottom: 1.75rem;
        }

        /* --- Footer --- */
        .welcome-footer {
          background: var(--surface);
          border-top: 1px solid var(--border);
          padding: 1.25rem 1.5rem;
          text-align: center;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 600px) {
          .stat-item { padding: 0.75rem 1.25rem; border-right: none; border-bottom: 1px solid var(--border); }
          .stat-item:last-child { border-bottom: none; }
          .stats-inner { flex-direction: column; }
        }
      `}</style>

      <div className="welcome-page">
        {/* Hero */}
        <section className="hero">
          <div className="hero-inner">
            {env && (
              <div className="hero-env-badge">
                <span className="hero-env-dot" />
                {env} environment
              </div>
            )}
            <h1 className="hero-title">
            Tradenest — the marketplace<br />
            <span>built for independent sellers</span>
            </h1>
            <p className="hero-subtitle">
              List products, reach buyers, and process payments securely —
              all on a fully serverless AWS infrastructure.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="hero-btn-primary">Get Started Free</Link>
              <Link to="/login" className="hero-btn-secondary">Sign In</Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-bar">
          <div className="stats-inner">
            {[
              ["Serverless", "Architecture"],
              ["AWS Lambda", "Compute"],
              ["Stripe", "Payments"],
              ["S3 + DynamoDB", "Storage"],
            ].map(([val, label]) => (
              <div key={label} className="stat-item">
                <div className="stat-value">{val}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <section className="features-section">
          <div className="features-label">Platform Capabilities</div>
          <h2 className="features-heading">Everything you need to buy and sell</h2>
          <p className="features-subheading">
            From listing creation to order fulfillment, the full commerce workflow is covered.
          </p>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon-wrap">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AWS Infrastructure */}
        <section className="aws-section">
          <div className="aws-section-inner">
            <div style={{ textAlign: "center" }}>
              <div className="aws-badge">☁️ AWS Infrastructure</div>
              <h2 className="features-heading">Powered by Amazon Web Services</h2>
              <p className="features-subheading">
                Every layer of the stack runs on AWS managed services — zero servers to provision or maintain.
              </p>
            </div>
            <div className="aws-grid">
              {AWS_SERVICES.map((s) => (
                <div key={s.name} className="aws-card">
                  <div className="aws-card-header">
                    <div className="aws-icon">{s.icon}</div>
                    <div>
                      <div className="aws-name">{s.name}</div>
                      <div className="aws-category">{s.category}</div>
                    </div>
                  </div>
                  <p className="aws-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-strip">
          <h2>Ready to start selling?</h2>
          <p>Create an account in seconds. No credit card required.</p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/signup" className="hero-btn-primary">Create Account</Link>
            <Link to="/login" className="hero-btn-secondary">I already have an account</Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="welcome-footer">
          Tradenest · Built with React · AWS Lambda · API Gateway · DynamoDB · S3 · CloudFront · Cognito · SES · Stripe
        </footer>
      </div>
    </>
  );
};

export default Welcome;
