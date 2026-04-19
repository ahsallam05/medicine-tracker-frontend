import api from '../axios.js';

class DashboardService {
  async getStats() {
    const { data } = await api.get('/dashboard/stats');
    return data;
  }
}

export default new DashboardService();
