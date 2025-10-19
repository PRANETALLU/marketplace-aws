// pages/PaymentSuccess.jsx
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const PaymentSuccess = () => {
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    console.log("Payment succeeded for order:", orderId);
  }, []);

  return (
    <div className="p-5 text-center">
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your purchase. Your order ID is <strong>{orderId}</strong>.</p>
    </div>
  );
};

export default PaymentSuccess;
