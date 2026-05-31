import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Card, Tab, Nav, ListGroup, Button, Spinner } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import { getProductsBySeller } from "../services/products/api";
import { getOrdersPlaced } from "../services/orders/api";
import CreateProductForm from "../components/CreateProductForm";

const Dashboard = () => {
  const { user, loading } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (!loading && user) {
      const fetchDashboardData = async () => {
        try {
          const [sellerProducts, placedOrders] = await Promise.all([
            getProductsBySeller(),
            getOrdersPlaced(),
          ]);

          setProducts(sellerProducts);
          setOrders(placedOrders);
        } catch (error) {
          console.error("Error fetching dashboard data", error);
        }
      };

      fetchDashboardData();
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spinner animation="border" style={{ color: '#0d6efd' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-loading">
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Please log in to view your dashboard.</p>
      </div>
    );
  }

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

        .dashboard-wrapper {
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

        .dashboard-wrapper::before {
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

        .dashboard-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .dashboard-loading {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(-45deg, #0d6efd, #0a58ca, #3b82f6, #60a5fa);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }

        .dashboard-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 2rem 2.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.6s ease-out;
        }

        .dashboard-title {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .dashboard-subtitle {
          color: #64748b;
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .modern-nav-pills {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: fadeInUp 0.7s ease-out;
        }

        .modern-nav-pills .nav-link {
          color: #64748b;
          font-weight: 600;
          padding: 0.875rem 1.25rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          margin-bottom: 0.5rem;
          border: 2px solid transparent;
        }

        .modern-nav-pills .nav-link:hover {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(10, 88, 202, 0.1) 100%);
          color: #0d6efd;
        }

        .modern-nav-pills .nav-link.active {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
        }

        .dashboard-content {
          animation: fadeInUp 0.8s ease-out;
        }

        .modern-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .modern-card-body {
          padding: 2rem;
        }

        .modern-card h5 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1.5rem;
        }

        .profile-info {
          margin-bottom: 1.5rem;
        }

        .profile-info h5 {
          font-size: 1.75rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .profile-info p {
          color: #64748b;
          font-size: 1rem;
          margin: 0;
        }

        .modern-btn {
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          border: none;
          border-radius: 12px;
          padding: 0.75rem 2rem;
          font-weight: 700;
          color: white;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.4);
        }

        .modern-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 30px rgba(13, 110, 253, 0.5);
          background: linear-gradient(135deg, #0b5ed7 0%, #084298 100%);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin: 0;
        }

        .modern-list-group {
          border: none;
        }

        .modern-list-item {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.05) 0%, rgba(10, 88, 202, 0.05) 100%);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
        }

        .modern-list-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(13, 110, 253, 0.15);
          border-color: #0d6efd;
        }

        .modern-list-item span {
          color: #1e293b;
          font-weight: 600;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #64748b;
          font-size: 1rem;
        }

        .empty-state-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(10, 88, 202, 0.1) 100%);
          border-radius: 16px;
          padding: 1.5rem;
          border: 2px solid rgba(13, 110, 253, 0.2);
        }

        .stat-label {
          color: #64748b;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (max-width: 768px) {
          .dashboard-title {
            font-size: 2rem;
          }

          .dashboard-header {
            padding: 1.5rem;
          }

          .modern-card-body {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h2 className="dashboard-title">Dashboard</h2>
            <p className="dashboard-subtitle">Manage your products, orders, and profile</p>
          </div>

          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Row>
              <Col md={3} className="mb-4">
                <Nav variant="pills" className="flex-column modern-nav-pills">
                  <Nav.Item>
                    <Nav.Link eventKey="profile">👤 Profile Summary</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="products">🧑‍🎨 My Products</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="orders">📦 My Orders</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>

              <Col md={9}>
                <div className="dashboard-content">
                  <Tab.Content>
                    <Tab.Pane eventKey="profile">
                      <div className="modern-card">
                        <div className="modern-card-body">
                          <div className="profile-info">
                            <h5>{user.username}</h5>
                            <p>Email: {user.email}</p>
                          </div>

                          <div className="stats-grid">
                            <div className="stat-card">
                              <div className="stat-label">Total Products</div>
                              <div className="stat-value">{products.length}</div>
                            </div>
                            <div className="stat-card">
                              <div className="stat-label">Total Orders</div>
                              <div className="stat-value">{orders.length}</div>
                            </div>
                          </div>

                          <Button className="modern-btn">Edit Profile</Button>
                        </div>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="products">
                      <div className="modern-card">
                        <div className="modern-card-body">
                          <div className="section-header">
                            <h5 className="section-title">My Products</h5>
                          </div>

                          <CreateProductForm
                            onProductCreated={(newProduct) =>
                              setProducts([newProduct, ...products])
                            }
                          />

                          {products.length === 0 ? (
                            <div className="empty-state">
                              <div className="empty-state-icon">📦</div>
                              <p>No products listed yet.</p>
                            </div>
                          ) : (
                            <ListGroup className="modern-list-group">
                              {products.map((p) => (
                                <ListGroup.Item
                                  key={p.productId}
                                  className="modern-list-item d-flex justify-content-between align-items-center"
                                >
                                  <span>{p.productName}</span>
                                  <span>
                                    ${p.price} (Qty: {p.quantity})
                                  </span>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          )}
                        </div>
                      </div>
                    </Tab.Pane>

                    <Tab.Pane eventKey="orders">
                      <div className="modern-card">
                        <div className="modern-card-body">
                          <div className="section-header">
                            <h5 className="section-title">My Orders</h5>
                          </div>

                          {orders.length === 0 ? (
                            <div className="empty-state">
                              <div className="empty-state-icon">🛒</div>
                              <p>No orders placed yet.</p>
                            </div>
                          ) : (
                            <ListGroup className="modern-list-group">
                              {orders.map((o) => (
                                <ListGroup.Item
                                  key={o.orderId}
                                  className="modern-list-item d-flex justify-content-between align-items-center"
                                >
                                  <span>Order #{o.orderId}</span>
                                  <span>
                                    {o.status} — ${o.totalPrice}
                                  </span>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          )}
                        </div>
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      </div>
    </>
  );
};

export default Dashboard;