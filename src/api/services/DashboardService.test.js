import { describe, it, expect, vi, beforeEach } from 'vitest';
import { dashboardService } from './DashboardService';
import api from '../axios';

vi.mock('../axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('DashboardService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should normalize snake_case response', async () => {
    const mockData = {
      data: {
        total_medicines: 10,
        expired_count: 2,
        critical_count: 1,
        expiring_soon_count: 3,
        out_of_stock_count: 0,
        running_low_count: 4
      }
    };
    api.get.mockResolvedValueOnce({ data: mockData });

    const stats = await dashboardService.getStats();
    expect(stats.totalMedicines).toBe(10);
    expect(stats.expiredCount).toBe(2);
    expect(stats.criticalCount).toBe(1);
  });

  it('should normalize camelCase response', async () => {
    const mockData = {
      totalMedicines: 10,
      expiredCount: 2,
      criticalCount: 1,
      expiringSoonCount: 3,
      outOfStockCount: 0,
      runningLowCount: 4
    };
    api.get.mockResolvedValueOnce({ data: mockData });

    const stats = await dashboardService.getStats();
    expect(stats.totalMedicines).toBe(10);
    expect(stats.expiredCount).toBe(2);
  });

  it('should use default values if data is missing', async () => {
    api.get.mockResolvedValueOnce({ data: {} });
    const stats = await dashboardService.getStats();
    expect(stats.totalMedicines).toBe(0);
    expect(stats.expiredCount).toBe(0);
  });

  it('should coerce non-numeric values to 0', async () => {
    const mockData = { total: 'invalid', expired: null };
    api.get.mockResolvedValueOnce({ data: mockData });
    const stats = await dashboardService.getStats();
    expect(stats.totalMedicines).toBe(0);
    expect(stats.expiredCount).toBe(0);
  });

  describe('getRecentActivity', () => {
    it('should return normalized activities', async () => {
      const mockData = { data: [{ id: 1 }] };
      api.get.mockResolvedValueOnce({ data: mockData });
      
      const activities = await dashboardService.getRecentActivity();
      expect(activities).toEqual([{ id: 1 }]);
    });

    it('should handle different response shapes', async () => {
      api.get.mockResolvedValueOnce({ data: { activities: [1, 2] } });
      expect(await dashboardService.getRecentActivity()).toEqual([1, 2]);
      
      api.get.mockResolvedValueOnce({ data: [3] });
      expect(await dashboardService.getRecentActivity()).toEqual([3]);
    });
  });
});
