import api from '../axios.js';

function normalizeLoginResponse(payload) {
  const source = payload?.data ?? payload;
  const token = source?.token ?? source?.accessToken ?? null;
  const user = source?.user ?? source?.pharmacist ?? source?.admin ?? null;

  return { token, user };
}

class AuthService {
  async login(username, password) {
    const { data } = await api.post('/auth/login', { username, password });
    return normalizeLoginResponse(data);
  }
}

export default new AuthService();
