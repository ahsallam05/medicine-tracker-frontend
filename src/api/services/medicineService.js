import api from '../axios.js';

class MedicineService {
  async getAll(params = {}) {
    const { data } = await api.get('/medicines', { params });
    return data;
  }

  async getById(id) {
    const { data } = await api.get(`/medicines/${id}`);
    return data;
  }

  async create(body) {
    const { data } = await api.post('/medicines', body);
    return data;
  }

  async update(id, body) {
    const { data } = await api.put(`/medicines/${id}`, body);
    return data;
  }

  async remove(id) {
    const { data } = await api.delete(`/medicines/${id}`);
    return data;
  }
}

export default new MedicineService();
