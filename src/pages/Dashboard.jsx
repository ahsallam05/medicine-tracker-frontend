import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  Inbox,
  PackageX,
  Pill,
  Skull,
} from 'lucide-react';
import dashboardService from '../api/services/dashboardService';
import medicineService from '../api/services/medicineService';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import BadgeFactory from '../utils/BadgeFactory';

function normalizeStats(payload) {
  const source =
    payload?.data?.stats ??
    payload?.data?.data ??
    payload?.counts ??
    payload?.stats ??
    payload?.data ??
    payload ??
    {};

  const readValue = (...keys) => {
    for (const key of keys) {
      if (source?.[key] !== undefined && source?.[key] !== null) {
        return source[key];
      }
    }
    return 0;
  };

  const toCount = (value) => {
    if (Array.isArray(value)) return value.length;
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  return {
    totalMedicines: toCount(
      readValue(
        'totalMedicines',
        'total_medicines',
        'total',
        'medicinesCount',
        'medicines_count',
      ),
    ),
    expiredCount: toCount(readValue('expiredCount', 'expired_count', 'expired')),
    criticalCount: toCount(
      readValue('criticalCount', 'critical_count', 'critical'),
    ),
    expiringSoonCount: toCount(
      readValue(
        'expiringSoonCount',
        'expiring_soon_count',
        'expiringSoon',
        'expiring_soon',
      ),
    ),
    outOfStockCount: toCount(
      readValue(
        'outOfStockCount',
        'out_of_stock_count',
        'outOfStock',
        'out_of_stock',
      ),
    ),
    runningLowCount: toCount(
      readValue(
        'runningLowCount',
        'running_low_count',
        'runningLow',
        'running_low',
      ),
    ),
  };
}

function formatDate(dateRaw) {
  if (!dateRaw) return '—';
  const d = new Date(dateRaw);
  if (Number.isNaN(d.getTime())) return String(dateRaw);
  return d.toLocaleDateString();
}

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={`stat-skeleton-${idx}`}
          className="h-[86px] animate-pulse rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200"
        >
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="mt-3 h-7 w-16 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, accentClass, onClick }) {
  const clickable = typeof onClick === 'function';
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      className={`w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-gray-200 transition ${
        clickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-600 sm:text-sm">{title}</div>
          <div className="mt-1 text-xl font-bold text-slate-800 sm:text-2xl">{value}</div>
        </div>
        <div
          className={`ml-4 inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 sm:h-10 sm:w-10 ${accentClass}`}
        >
          {Icon ? <Icon className="h-4 w-4 sm:h-5 sm:w-5" /> : null}
        </div>
      </div>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState('');
  const [stats, setStats] = useState(() => normalizeStats(null));

  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [recentError, setRecentError] = useState('');
  const [recentMedicines, setRecentMedicines] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      setIsLoadingStats(true);
      setStatsError('');
      try {
        const res = await dashboardService.getStats();
        if (!isMounted) return;
        setStats(normalizeStats(res));
      } catch (err) {
        if (!isMounted) return;
        setStatsError(
          err?.response?.data?.message ||
            'Failed to load dashboard statistics.',
        );
      } finally {
        if (isMounted) setIsLoadingStats(false);
      }
    }

    async function loadRecent() {
      setIsLoadingRecent(true);
      setRecentError('');
      try {
        const res = await medicineService.getAll({
          page: 1,
          limit: 10,
          sortBy: 'created_at',
          order: 'desc',
        });

        if (!isMounted) return;
        setRecentMedicines(res?.medicines ?? []);
      } catch (err) {
        if (!isMounted) return;
        setRecentError(
          err?.response?.data?.message || 'Failed to load recent medicines.',
        );
      } finally {
        if (isMounted) setIsLoadingRecent(false);
      }
    }

    loadStats();
    loadRecent();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        title: 'Total Medicines',
        value: stats.totalMedicines,
        icon: Pill,
        accentClass: 'bg-teal-50 text-teal-600 ring-teal-100',
        onClick: null,
      },
      {
        title: 'Expired',
        value: stats.expiredCount,
        icon: Skull,
        accentClass: 'bg-red-50 text-red-600 ring-red-100',
        onClick: () => navigate('/alerts?section=expired'),
      },
      {
        title: 'Critical',
        value: stats.criticalCount,
        icon: AlertCircle,
        accentClass: 'bg-orange-50 text-orange-500 ring-orange-100',
        onClick: () => navigate('/alerts?section=critical'),
      },
      {
        title: 'Expiring Soon',
        value: stats.expiringSoonCount,
        icon: Clock,
        accentClass: 'bg-yellow-50 text-yellow-500 ring-yellow-100',
        onClick: () => navigate('/alerts?section=expiringSoon'),
      },
      {
        title: 'Out of Stock',
        value: stats.outOfStockCount,
        icon: PackageX,
        accentClass: 'bg-gray-100 text-gray-500 ring-gray-200',
        onClick: () => navigate('/alerts?section=outOfStock'),
      },
      {
        title: 'Running Low',
        value: stats.runningLowCount,
        icon: AlertTriangle,
        accentClass: 'bg-amber-50 text-amber-500 ring-amber-100',
        onClick: () => navigate('/alerts?section=runningLow'),
      },
    ],
    [navigate, stats],
  );

  return (
    <div className="space-y-6">
      <div>
        {isLoadingStats ? (
          <StatCardsSkeleton />
        ) : (
          <>
            {statsError ? (
              <div className="mb-4 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {statsError}
              </div>
            ) : null}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {cards.map((c) => (
                <StatCard
                  key={c.title}
                  title={c.title}
                  value={c.value}
                  icon={c.icon}
                  accentClass={c.accentClass}
                  onClick={c.onClick ?? undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <h2 className="mb-3 text-sm font-semibold text-slate-800">
          Recent Medicines
        </h2>

        {recentError ? (
          <div className="mb-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {recentError}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Expiry Date</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingRecent ? (
                <tr>
                  <td colSpan={5} className="px-3 py-6">
                    <Spinner />
                  </td>
                </tr>
              ) : recentMedicines.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-sm text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="h-8 w-8 text-slate-300" />
                      <span>No medicines added yet</span>
                    </div>
                  </td>
                </tr>
              ) : (
                recentMedicines.map((m) => {
                  const meta = BadgeFactory.create(m);
                  return (
                    <tr key={m.id ?? `${m.name}-${m.expiry_date}`}>
                      <td className="px-3 py-2 text-sm font-medium text-slate-800">
                        {m.name}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {m.category ?? '—'}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {m.quantity ?? 0}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {formatDate(m.expiry_date)}
                      </td>
                      <td className="px-3 py-2">
                        <Badge label={meta.label} color={meta.color} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
