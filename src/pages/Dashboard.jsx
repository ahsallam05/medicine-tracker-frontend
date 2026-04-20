import { useNavigate } from 'react-router-dom';
import { Pill, Skull, AlertCircle, Clock, PackageX, AlertTriangle } from 'lucide-react';
import { dashboardService, medicineService } from '../api';
import { Badge, Spinner, StatCard, StatCardsSkeleton } from '../components/shared';
import { useApi } from '../hooks';
import { BadgeFactory, formatDate } from '../utils';

export default function Dashboard() {
  const navigate = useNavigate();

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useApi(dashboardService.getStats, {
    immediate: true,
    initialData: {
      totalMedicines: 0, expiredCount: 0, criticalCount: 0,
      expiringSoonCount: 0, outOfStockCount: 0, runningLowCount: 0,
    },
  });

  const {
    data: recentMedicines,
    isLoading: recentLoading,
  } = useApi(medicineService.getAll, {
    immediate: true,
    initialData: { medicines: [] },
  });

  if (statsError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-600 ring-1 ring-red-100">
        <p className="font-semibold">Error loading dashboard</p>
        <p className="mt-1 text-sm">{statsError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:grid-cols-3">
        {statsLoading ? (
          <StatCardsSkeleton />
        ) : (
          <>
            <StatCard title="Total Inventory" value={stats.totalMedicines} color="teal" icon={Pill} onClick={() => navigate('/medicines')} />
            <StatCard title="Expired Items" value={stats.expiredCount} color="red" icon={Skull} onClick={() => navigate('/alerts?section=expired')} />
            <StatCard title="Critical Items" value={stats.criticalCount} color="orange" icon={AlertCircle} onClick={() => navigate('/alerts?section=critical')} />
            <StatCard title="Expiring Soon" value={stats.expiringSoonCount} color="yellow" icon={Clock} onClick={() => navigate('/alerts?section=expiringSoon')} />
            <StatCard title="Out of Stock" value={stats.outOfStockCount} color="red" icon={PackageX} onClick={() => navigate('/alerts?section=outOfStock')} />
            <StatCard title="Running Low" value={stats.runningLowCount} color="amber" icon={AlertTriangle} onClick={() => navigate('/alerts?section=runningLow')} />
          </>
        )}
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
        <h3 className="mb-6 text-lg font-bold text-slate-800">Recently Added</h3>
        <div className="overflow-x-auto">
          {recentLoading ? (
            <Spinner className="py-12" />
          ) : recentMedicines.medicines.length === 0 ? (
            <p className="py-12 text-center text-slate-500">No medicines found</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-4 px-2">Medicine</th>
                  <th className="pb-4 px-2">Category</th>
                  <th className="pb-4 px-2">Stock</th>
                  <th className="pb-4 px-2">Expiry</th>
                  <th className="pb-4 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentMedicines.medicines.slice(0, 5).map((m) => {
                  const badge = BadgeFactory.create(m);
                  return (
                    <tr key={m.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-2 text-sm font-bold text-slate-800">{m.name}</td>
                      <td className="py-4 px-2 text-sm text-slate-500 font-medium">{m.category}</td>
                      <td className="py-4 px-2 text-sm text-slate-600 font-semibold">{m.quantity}</td>
                      <td className="py-4 px-2 text-sm text-slate-500">{formatDate(m.expiry_date)}</td>
                      <td className="py-4 px-2">
                        <Badge label={badge.label} color={badge.color} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
