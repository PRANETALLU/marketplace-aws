import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmSignUp } from '../../services/auth';

const ConfirmSignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    username: location.state?.username || '',
    code: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!location.state?.username) {
      console.warn('No username provided; user must enter manually');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await confirmSignUp(formData.username, formData.code);
      alert('Account confirmed! Please sign in.');
      navigate('/signin');
    } catch (err) {
      setError(err.message || 'Failed to confirm account');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>Confirm Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Verification Code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          required
        />
        <button type="submit">Confirm</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Back to <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default ConfirmSignUp;