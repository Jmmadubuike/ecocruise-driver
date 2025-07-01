'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchUser = async () => {
    if (user) {
      setInitialLoading(false); 
      return;
    }
    setInitialLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/me`, { credentials: 'include' });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else if (data._id) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("fetchUser error:", err);
      setUser(null);
    } finally {
      setInitialLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoginLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || 'Login failed');
      }
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else if (data._id) {
        setUser(data);
      } else {
        await fetchUser();
      }
    } catch (err) {
      console.error("login error:", err);
      throw err;
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = async () => {
    setInitialLoading(true); 
    try {
      await fetch(`${baseUrl}/api/v1/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      router.push('/login');
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const loading = initialLoading || loginLoading;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
