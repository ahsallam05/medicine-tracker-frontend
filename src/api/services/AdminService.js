import api from '../axios';

class AdminService {
  async getAll() {
    const { data } = await api.get('/admin/pharmacists');
    return data?.data ?? data ?? [];
  }

  async create(body) {
    return api.post('/admin/pharmacists', body);
  }

  async update(id, body) {
    return api.put(`/admin/pharmacists/${id}`, body);
  }

  async updateStatus(id, is_active) {
    return api.patch(`/admin/pharmacists/${id}/status`, { is_active });
  }

  async remove(id) {
    return api.delete(`/admin/pharmacists/${id}`);
  }
}

export const adminService = new AdminService();
