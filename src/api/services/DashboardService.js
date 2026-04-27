import api from '../axios';

class DashboardService {
  async getStats() {
    const { data } = await api.get('/dashboard/stats');
    const source = data?.data ?? data?.stats ?? data ?? {};
    const toCount = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
    return {
      totalMedicines:   toCount(source.total_medicines   || source.totalMedicines   || source.total),
      expiredCount:     toCount(source.expired_count     || source.expiredCount     || source.expired),
      criticalCount:    toCount(source.critical_count    || source.criticalCount    || source.critical),
      expiringSoonCount:toCount(source.expiring_soon_count|| source.expiringSoonCount|| source.expiring_soon),
      outOfStockCount:  toCount(source.out_of_stock_count|| source.outOfStockCount  || source.out_of_stock),
      runningLowCount:  toCount(source.running_low_count || source.runningLowCount  || source.running_low),
    };
  }

  async getRecentActivity() {
    const { data } = await api.get('/dashboard/recent-activity');
    return data?.data ?? data?.activities ?? data ?? [];
  }
}

export const dashboardService = new DashboardService();
