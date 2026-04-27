import api from '../axios';

class AuthService {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    let data = response.data;
    
    // Fallback if backend returns stringified JSON without application/json header
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch (e) { /* ignore */ }
    }

    // Deep search for user and token
    const user  = data?.user  || data?.data?.user  || data?.body?.user;
    const token = data?.token || data?.data?.token || data?.access_token || data?.data?.access_token;
    
    if (!user || !token) {
      throw new Error('Login response is missing token or user data.');
    }
    
    return { user, token };
  }
}

export const authService = new AuthService();
