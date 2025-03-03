import { createContext, useState, useEffect } from "react";
import { Amplify, Auth } from "aws-amplify";
import awsConfig from "./aws-exports";

Amplify.configure(awsConfig);

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user session on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setUser(authUser);
      } catch {
        setUser(null);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  // Sign Up
  const signUp = async (email, password) => {
    try {
      await Auth.signUp({ username: email, password, attributes: { email } });
      return "Success! Check your email for verification.";
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Confirm Sign Up
  const confirmSignUp = async (email, code) => {
    try {
      await Auth.confirmSignUp(email, code);
      return "Account verified!";
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const authUser = await Auth.signIn(email, password);
      setUser(authUser);
      return authUser;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    await Auth.signOut();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, signUp, confirmSignUp, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};
