import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { getProducts } from '../services/products/api';
import { UserContext } from "../context/UserContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchProducts();
  }, []);

  console.log('Home Products', products);
  console.log('Home User', user);

  return (
    <>
      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .home-wrapper {
          min-height: 100vh;
          width: 100vw;
          background: linear-gradient(-45deg, #0d6efd, #0a58ca, #3b82f6, #60a5fa);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          padding: 6rem 0 3rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow-y: auto;
        }

        .home-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s ease-in-out infinite;
          z-index: 0;
        }

        .home-container {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .home-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.6s ease-out;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .home-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .modern-dashboard-btn {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          border: none;
          border-radius: 12px;
          padding: 0.75rem 2rem;
          font-weight: 700;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
          display: inline-block;
        }

        .modern-dashboard-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(13, 110, 253, 0.5);
          background: linear-gradient(135deg, #0b5ed7 0%, #084298 100%);
          color: white;
        }

        .products-grid {
          animation: fadeInUp 0.8s ease-out;
        }

        .product-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          transition: all 0.4s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          animation: scaleIn 0.5s ease-out;
          animation-fill-mode: backwards;
        }

        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border-color: rgba(13, 110, 253, 0.5);
        }

        .product-image-wrapper {
          position: relative;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(10, 88, 202, 0.05) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
        }

        .product-image {
          max-width: 100%;
          height: auto;
          max-height: 180px;
          object-fit: contain;
          transition: transform 0.3s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        .product-card-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .product-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .product-view-btn {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          border: none;
          border-radius: 12px;
          padding: 0.75rem 1.5rem;
          font-weight: 700;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3);
          margin-top: auto;
          text-align: center;
          display: block;
        }

        .product-view-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
          background: linear-gradient(135deg, #0b5ed7 0%, #084298 100%);
          color: white;
        }

        .empty-state {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 4rem 2rem;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.8s ease-out;
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-state-text {
          color: #64748b;
          font-size: 1.25rem;
          font-weight: 600;
        }

        /* Stagger animation for product cards */
        .product-card:nth-child(1) { animation-delay: 0.1s; }
        .product-card:nth-child(2) { animation-delay: 0.2s; }
        .product-card:nth-child(3) { animation-delay: 0.3s; }
        .product-card:nth-child(4) { animation-delay: 0.4s; }
        .product-card:nth-child(5) { animation-delay: 0.5s; }
        .product-card:nth-child(6) { animation-delay: 0.6s; }
        .product-card:nth-child(7) { animation-delay: 0.7s; }
        .product-card:nth-child(8) { animation-delay: 0.8s; }

        @media (max-width: 768px) {
          .home-title {
            font-size: 2rem;
          }

          .home-header {
            padding: 1.5rem;
            flex-direction: column;
            align-items: flex-start;
          }

          .modern-dashboard-btn {
            width: 100%;
            text-align: center;
          }

          .product-card-body {
            padding: 1.25rem;
          }
        }
      `}</style>

      <div className="home-wrapper">
        <div className="home-container">
          <div className="home-header">
            <h2 className="home-title">Available Products</h2>
            {user && (
              <Link to="/dashboard" className="modern-dashboard-btn">
                Go to Dashboard
              </Link>
            )}
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛍️</div>
              <p className="empty-state-text">No products available at the moment</p>
            </div>
          ) : (
            <Row className="products-grid">
              {products.map((product) => (
                <Col md={6} lg={4} xl={3} className="mb-4" key={product.productId}>
                  <div className="product-card">
                    <div className="product-image-wrapper">
                      <img
                        src={product.image || "https://via.placeholder.com/200"}
                        alt={product.productName}
                        className="product-image"
                      />
                    </div>
                    <div className="product-card-body">
                      <h3 className="product-title">{product.productName}</h3>
                      <div className="product-price">${product.price}</div>
                      <Link
                        to={`/product/${product.productId}`}
                        className="product-view-btn"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;