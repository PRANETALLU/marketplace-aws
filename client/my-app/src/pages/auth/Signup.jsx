import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp, confirmSignUp } from '../../services/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    code: '',
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isConfirming) {
      try {
        await signUp(formData.username, formData.email, formData.password);
        setIsConfirming(true);
      } catch (err) {
        setError(err.message || 'Failed to sign up');
      }
    } else {
      try {
        await confirmSignUp(formData.username, formData.code);
        alert('Account confirmed! Please sign in.');
        navigate('/login');
      } catch (err) {
        setError(err.message || 'Failed to confirm account');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h2>{isConfirming ? 'Confirm Your Account' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        {!isConfirming && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </>
        )}
        {isConfirming && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              disabled
            />
            <input
              type="text"
              placeholder="Verification Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
          </>
        )}
        <button type="submit">{isConfirming ? 'Confirm' : 'Sign Up'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Signup;