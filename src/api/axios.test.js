import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './axios';

describe('Axios Interceptors', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    
    // Mock window.location.replace using stubGlobal
    vi.stubGlobal('location', { replace: vi.fn(), href: 'http://localhost/' });
  });

  it('should not attach Authorization header to auth login requests', async () => {
    localStorage.setItem('token', 't123');
    // Accessing private/internal handlers is brittle but works for unit testing logic
    const requestInterceptor = api.interceptors.request.handlers[0].fulfilled;
    const config = { url: '/auth/login', headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should attach Authorization header to non-auth requests if token exists', async () => {
    localStorage.setItem('token', 't123');
    const requestInterceptor = api.interceptors.request.handlers[0].fulfilled;
    const config = { url: '/medicines', headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBe('Bearer t123');
  });

  it('should not attach Authorization header if token is missing', async () => {
    const requestInterceptor = api.interceptors.request.handlers[0].fulfilled;
    const config = { url: '/medicines', headers: {} };
    const result = requestInterceptor(config);
    expect(result.headers.Authorization).toBeUndefined();
  });

  it('should redirect to /403 on 403 response', async () => {
    const responseInterceptor = api.interceptors.response.handlers[0].rejected;
    const error = { response: { status: 403 }, config: { url: '/admin' } };
    
    try {
      await responseInterceptor(error);
    } catch (e) {
      // ignore rejection
    }
    
    expect(location.replace).toHaveBeenCalledWith('/403');
  });

  it('should be a singleton (multiple imports return same instance)', async () => {
    const api2 = (await import('./axios')).default;
    expect(api).toBe(api2);
  });
});
