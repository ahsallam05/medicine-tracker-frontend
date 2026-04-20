import api from './client';

export const medicineService = {
  async getAll(params) {
    const { data } = await api.get('/medicines', { params });
    const source = data ?? {};
    return {
      medicines: Array.isArray(source.medicines) ? source.medicines : [],
      page: Number(source.pagination?.page ?? 1),
      totalPages: Number(source.pagination?.pages ?? 1),
      total: Number(source.pagination?.total ?? 0),
    };
  },
  async create(body) { return api.post('/medicines', body); },
  async update(id, body) { return api.put(`/medicines/${id}`, body); },
  async remove(id) { return api.delete(`/medicines/${id}`); },
  
  CATEGORIES: [
    'All', 'Antipyretics', 'Antibiotics', 'Antidiabetics', 'Cardiovascular',
    'Respiratory', 'Gastrointestinal', 'Neurological', 'Supplements',
    'Dermatology', 'Ophthalmology', 'Endocrinology', 'Antivirals', 'Urology',
  ]
};

export const dashboardService = {
  async getStats() {
    const { data } = await api.get('/dashboard/stats');
    const source = data?.data ?? data?.stats ?? data ?? {};
    const toCount = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    return {
      totalMedicines: toCount(source.total_medicines || source.totalMedicines || source.total),
      expiredCount: toCount(source.expired_count || source.expiredCount || source.expired),
      criticalCount: toCount(source.critical_count || source.criticalCount || source.critical),
      expiringSoonCount: toCount(source.expiring_soon_count || source.expiringSoonCount || source.expiring_soon),
      outOfStockCount: toCount(source.out_of_stock_count || source.outOfStockCount || source.out_of_stock),
      runningLowCount: toCount(source.running_low_count || source.runningLowCount || source.running_low),
    };
  },
  async getRecentActivity() {
    const { data } = await api.get('/dashboard/recent-activity');
    return data?.data ?? data?.activities ?? data ?? [];
  }
};

export const alertService = {
  async getAll() {
    const { data } = await api.get('/alerts');
    const source = data?.data ?? {};
    const sortDate = (arr, desc = true) => 
      [...(arr ?? [])].sort((a, b) => desc 
        ? new Date(b.expiry_date) - new Date(a.expiry_date)
        : new Date(a.expiry_date) - new Date(b.expiry_date)
      );

    return {
      expired: sortDate(source.expired, true),
      critical: sortDate(source.critical, false),
      expiringSoon: sortDate(source.expiring_soon, false),
      outOfStock: source.out_of_stock ?? [],
      runningLow: [...(source.running_low ?? [])].sort((a, b) => a.quantity - b.quantity),
    };
  }
};

export const adminService = {
  async getAll() {
    const { data } = await api.get('/admin/pharmacists');
    return data?.data ?? data ?? [];
  },
  async create(body) { return api.post('/admin/pharmacists', body); },
  async update(id, data) { return api.put(`/admin/pharmacists/${id}`, data); },
  async updateStatus(id, is_active) { return api.patch(`/admin/pharmacists/${id}/status`, { is_active }); },
  async remove(id) { return api.delete(`/admin/pharmacists/${id}`); }
};

export const authService = {
  async login(username, password) {
    const { data } = await api.post('/auth/login', { username, password });
    return data;
  }
};
