'use client';
// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, logoutUser, getToken, getUser } from '../lib/auth';
import { setAgeCookie } from '../lib/gate';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    const savedToken = getToken();
    const savedUser = getUser();
    if (savedToken) {
      setToken(savedToken);
      // Signed-in customers confirmed 21+ at sign-up: keep the server-side age gate
      // cookie in step with the session (covers accounts from before the gate existed).
      setAgeCookie();
    }
    if (savedUser) setUser(savedUser);
  }, []);

  // Research-access status (pending email confirmation / pending approval / approved).
  // Only approved accounts can buy; the backend enforces it, this drives the messaging.
  const [accountStatus, setAccountStatus] = useState(null);
  const refreshAccountStatus = useCallback(async () => {
    const t = getToken();
    if (!t) { setAccountStatus(null); return null; }
    try {
      const res = await fetch('/api/account-status', { headers: { Authorization: `Bearer ${t}` }, cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();
      if (data && typeof data.canPurchase === 'boolean') {
        setAccountStatus(data);
        return data;
      }
    } catch {}
    return null;
  }, []);
  useEffect(() => { if (token) refreshAccountStatus(); else setAccountStatus(null); }, [token, refreshAccountStatus]);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginUser(username, password);
      if (result.success) {
        setAgeCookie();
        if (result.user.iw_account) setAccountStatus(result.user.iw_account);
        setToken(result.user.token);
        setUser({
          email: result.user.user_email,
          name: result.user.user_display_name,
          nicename: result.user.user_nicename,
        });
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setToken(null);
    setUser(null);
    setAccountStatus(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn: !!token && mounted,
      loading,
      error,
      login,
      logout,
      mounted,
      accountStatus,
      refreshAccountStatus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
