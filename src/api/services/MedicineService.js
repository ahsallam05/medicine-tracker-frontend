import api from '../axios';

class MedicineService {
  async getAll(params) {
    const { data } = await api.get('/medicines', { params });
    const source = data ?? {};
    return {
      medicines: Array.isArray(source.medicines) ? source.medicines : [],
      page: Number(source.pagination?.page ?? 1),
      totalPages: Number(source.pagination?.pages ?? 1),
      total: Number(source.pagination?.total ?? 0),
    };
  }

  async create(body) {
    return api.post('/medicines', body);
  }

  async update(id, body) {
    return api.put(`/medicines/${id}`, body);
  }

  async remove(id) {
    return api.delete(`/medicines/${id}`);
  }
}

export const medicineService = new MedicineService();
