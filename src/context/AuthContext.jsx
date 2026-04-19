/* eslint-disable react-refresh/only-export-components -- context + provider in one module */
import { createContext, useCallback, useMemo, useState } from 'react';

export const AuthContext = createContext(null);

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

  const login = useCallback((nextUser, nextToken) => {
    setAuth({ user: nextUser, token: nextToken });
    localStorage.setItem('token', nextToken);
    localStorage.setItem('user', JSON.stringify(nextUser));
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const value = useMemo(
    () => ({
      user: auth.user,
      token: auth.token,
      login,
      logout,
      isAuthenticated: Boolean(auth.token && auth.user),
    }),
    [auth.user, auth.token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
