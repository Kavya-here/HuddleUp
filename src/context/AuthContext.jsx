import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the Authentication Context
export const AuthContext = createContext(null);

// 2. Define the AuthProvider Wrapper
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if a user session is already saved on your browser
  useEffect(() => {
    const storedUser = localStorage.getItem('huddleup_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user session:', e);
      }
    }
    setLoading(false);
  }, []);

  // Mock login function for local development
  const loginUser = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      // For development, allow any email/password combo
      if (email && password) {
        const mockUser = {
          uid: 'user_' + Math.random().toString(36).substr(2, 9),
          email: email,
          name: email.split('@')[0],
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`
        };
        setUser(mockUser);
        localStorage.setItem('huddleup_user', JSON.stringify(mockUser));
        return true;
      } else {
        throw new Error('Please fill in both email and password.');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('huddleup_user');
  };

  const value = {
    user,
    loading,
    error,
    loginUser,
    logoutUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Define and export the custom useAuth hook (This was missing!)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};