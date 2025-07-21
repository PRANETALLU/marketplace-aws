import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">No product found</h2>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const handlePlaceOrder = () => {
    // Add API call or order logic here
    alert(`Order placed for ${product.productName}`);
    navigate('/orders'); // Navigate to orders page if you have one
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="border p-4 rounded shadow">
        <h3 className="text-lg font-semibold">{product.productName}</h3>
        <p className="text-gray-700">{product.description}</p>
        <p className="mt-2 text-xl font-medium">${product.price.toFixed(2)}</p>
        <p className="mt-1 text-sm text-gray-500">Category: {product.category}</p>
        <p className="mt-1 text-sm text-gray-500">Available: {product.quantity}</p>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          placeholder="Enter shipping address"
          className="border rounded px-4 py-2 w-full sm:w-2/3 mb-4 sm:mb-0"
        />
        <button
          onClick={handlePlaceOrder}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
