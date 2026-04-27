import api from '../axios';

function sortByDate(arr, desc = true) {
  return [...(arr ?? [])].sort((a, b) =>
    desc
      ? new Date(b.expiry_date) - new Date(a.expiry_date)
      : new Date(a.expiry_date) - new Date(b.expiry_date)
  );
}

class AlertService {
  async getAll() {
    const { data } = await api.get('/alerts');
    const source = data?.data ?? {};
    return {
      expired:      sortByDate(source.expired, true),
      critical:     sortByDate(source.critical, false),
      expiringSoon: sortByDate(source.expiring_soon, false),
      outOfStock:   source.out_of_stock ?? [],
      runningLow:   [...(source.running_low ?? [])].sort((a, b) => a.quantity - b.quantity),
    };
  }
}

export const alertService = new AlertService();
