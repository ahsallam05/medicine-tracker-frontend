import api from '../axios.js';

class AdminService {
  async getAll() {
    return api.get('/admin/pharmacists');
  }

  async create(body) {
    const { data } = await api.post('/admin/pharmacists', body);
    return data;
  }

  async update(id, data) {
    const { data: res } = await api.put(`/admin/pharmacists/${id}`, data);
    return res;
  }

  async updateStatus(id, is_active) {
    const { data } = await api.patch(`/admin/pharmacists/${id}/status`, {
      is_active,
    });
    return data;
  }

  async remove(id) {
    const { data } = await api.delete(`/admin/pharmacists/${id}`);
    return data;
  }
}

export default new AdminService();
