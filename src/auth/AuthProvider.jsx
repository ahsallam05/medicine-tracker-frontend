import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../api/services/AuthService';

function readStoredAuth() {
  try {
    const token = localStorage.getItem('token');
    const user  = localStorage.getItem('user');
    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());

  // authService.login now returns normalized { user, token } — no need for double-path fallback
  const login = useCallback(async (username, password) => {
    const { user, token } = await authService.login(username, password);
    
    // Save to storage FIRST so subsequent reads (like by the axios interceptor) work immediately
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    // Then update state to trigger re-renders
    setAuth({ user, token });
    
    return { user, token };
  }, []);

  const logout = useCallback(() => {
    setAuth({ user: null, token: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // Note: We removed the auto-logout listener to match original behavior 
  // and prevent aggressive redirect loops on late-arriving 401s.

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
