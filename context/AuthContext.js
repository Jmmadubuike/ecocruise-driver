'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchUser = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (res.ok && data.user) setUser(data.user);
      else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
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
  setUser(data.user); // ✅ Immediately update user context
  return data;
};

  const logout = async () => {
    await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    router.push('/login');
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
