import api from '../axios.js';

class AlertService {
  async getAll() {
    const { data } = await api.get('/alerts');
    return data;
  }
}

export default new AlertService();
