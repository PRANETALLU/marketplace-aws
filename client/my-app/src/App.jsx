import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";
import SignUp from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import { UserProvider } from "./context/UserContext";
import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Header from "./components/Header";
import Home from "./pages/Home";
import { Container } from "react-bootstrap";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Header />
        <div style={{ paddingTop: "80px" }}>
          <Container className="py-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/product/:productId" element={<ProductDetails />} />

              {/* Protected Routes */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              {/*<Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />*/}

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
