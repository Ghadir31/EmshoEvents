import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);

  const resetAuth = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          resetAuth();
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error('Error verifying auth', err);
        resetAuth();
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error || 'Login failed' };
      }
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      console.error('Error logging in', err);
      return { ok: false, error: err.message };
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { ok: false, error: data?.error || 'Registration failed' };
      }
      setToken(data.token);
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      return { ok: true };
    } catch (err) {
      console.error('Error registering', err);
      return { ok: false, error: err.message };
    }
  };

  const logout = () => {
    resetAuth();
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      register,
      logout,
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
