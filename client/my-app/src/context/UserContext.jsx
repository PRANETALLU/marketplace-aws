// UserContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { getCurrentUserInfo, signOut as cognitoSignOut } from "../services/auth";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userInfo = await getCurrentUserInfo();
        if (userInfo) {
          setUser({
            id: userInfo.sub,
            username: userInfo["cognito:username"],
            email: userInfo.email,
            emailVerified: userInfo.email_verified,
          });
        }
      } catch (err) {
        console.error("Error initializing user:", err);
      } finally {
        setLoading(false);
      }
    };
    initializeUser();
  }, []);

  // New function to update user info after login
  const updateUserAfterLogin = async () => {
    try {
      const userInfo = await getCurrentUserInfo();
      if (userInfo) {
        setUser({
          id: userInfo.sub,
          username: userInfo["cognito:username"],
          email: userInfo.email,
          emailVerified: userInfo.email_verified,
        });
      }
      return userInfo;
    } catch (err) {
      console.error("Error updating user after login:", err);
      return null;
    }
  };

  const logout = async () => {
    try {
      await cognitoSignOut();
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, setUser, logout, updateUserAfterLogin }}>
      {children}
    </UserContext.Provider>
  );
};
