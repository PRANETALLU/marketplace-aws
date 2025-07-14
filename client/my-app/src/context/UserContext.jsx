import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUserInfo, getIdToken } from '../services/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userInfo = await getCurrentUserInfo();
        if (userInfo) {
          const token = await getIdToken();
          setUser(userInfo);
          setIdToken(token);
        }
      } catch (err) {
        console.error('Error initializing user:', err);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, []);

  const updateUserAfterLogin = async () => {
    try {
      const userInfo = await getCurrentUserInfo();
      const token = await getIdToken();
      setUser(userInfo);
      setIdToken(token);
      return userInfo;
    } catch (err) {
      console.error('Error updating user after login:', err);
      return null;
    }
  };

  const clearUserAfterLogout = () => {
    setUser(null);
    setIdToken(null);
  };

  return (
    <UserContext.Provider
      value={{ user, idToken, loading, updateUserAfterLogin, clearUserAfterLogout }}
    >
      {children}
    </UserContext.Provider>
  );
};
