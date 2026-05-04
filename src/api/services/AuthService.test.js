import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from './AuthService';
import api from '../axios';

vi.mock('../axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should normalize standard response { token, user }', async () => {
    const mockData = { token: 't123', user: { id: 1, name: 'Admin' } };
    api.post.mockResolvedValueOnce({ data: mockData });

    const result = await authService.login('admin', 'pass');
    expect(result).toEqual(mockData);
    expect(api.post).toHaveBeenCalledWith('/auth/login', { username: 'admin', password: 'pass' });
  });

  it('should normalize nested response { data: { token, user } }', async () => {
    const mockData = { token: 't123', user: { id: 1, name: 'Admin' } };
    api.post.mockResolvedValueOnce({ data: { data: mockData } });

    const result = await authService.login('admin', 'pass');
    expect(result).toEqual(mockData);
  });

  it('should handle access_token alias', async () => {
    const mockResponse = { access_token: 'at123', user: { id: 1 } };
    api.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.login('admin', 'pass');
    expect(result.token).toBe('at123');
    expect(result.user).toEqual({ id: 1 });
  });

  it('should handle stringified JSON response', async () => {
    const mockData = { token: 't123', user: { id: 1 } };
    api.post.mockResolvedValueOnce({ data: JSON.stringify(mockData) });

    const result = await authService.login('admin', 'pass');
    expect(result).toEqual(mockData);
  });

  it('should throw error if token or user is missing', async () => {
    api.post.mockResolvedValueOnce({ data: { only: 'stuff' } });
    await expect(authService.login('a', 'p')).rejects.toThrow('Login response is missing token or user data.');
  });
});
