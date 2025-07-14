import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import { listProduct } from '../services/api';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    description: '',
    image: null,
  });
  const [error, setError] = useState('');

  if (!user) {
    navigate('/signin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      formData.append(key, productData[key]);
    });

    try {
      //await listProduct(formData);
      alert('Product listed successfully!');
      setProductData({ name: '', price: '', description: '', image: null });
    } catch (error) {
      console.error('Error listing product:', error);
      setError('Failed to list product');
    }
  };

  return (
    <div className="seller-dashboard">
      <h2>List New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={productData.name}
          onChange={(e) => setProductData({ ...productData, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={productData.price}
          onChange={(e) => setProductData({ ...productData, price: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={productData.description}
          onChange={(e) => setProductData({ ...productData, description: e.target.value })}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProductData({ ...productData, image: e.target.files[0] })}
          required
        />
        <button type="submit">Add Product</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Dashboard;