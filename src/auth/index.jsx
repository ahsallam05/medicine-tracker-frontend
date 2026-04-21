/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { authService } from '../api';

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      return { token: storedToken, user: JSON.parse(storedUser) };
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());

  const login = useCallback(async (username, password) => {
    const res = await authService.login(username, password);
    const user = res?.user || res?.data?.user;
    const token = res?.token || res?.data?.token;

    if (!user || !token) {
      throw new Error('Invalid response from server');
    }
    setAuth({ user, token });
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return { user, token };
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Handle global 401 events from Axios
  useEffect(() => {
    const handleUnauthorized = () => logout();
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth-unauthorized', handleUnauthorized);
  }, [logout]);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      login,
      logout,
      isAuthenticated: Boolean(auth.token && auth.user),
    }),
    [auth.user, auth.token, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
