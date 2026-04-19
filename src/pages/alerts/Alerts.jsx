import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  AlertTriangle,
  Clock,
  PackageX,
  Skull,
} from 'lucide-react';
// AlertCircle imported for error display
import alertService from '../../api/services/alertService';
import AlertSection from '../../components/ui/AlertSection';
import Spinner from '../../components/ui/Spinner';

const SECTIONS = [
  {
    key: 'expired',
    title: 'Expired Medicines',
    icon: Skull,
    colorClass: 'bg-red-50 text-red-600 ring-red-200',
  },
  {
    key: 'critical',
    title: 'Critical — Expiring in 7 Days',
    icon: AlertCircle,
    colorClass: 'bg-orange-50 text-orange-500 ring-orange-200',
  },
  {
    key: 'expiringSoon',
    title: 'Expiring Soon — Within 30 Days',
    icon: Clock,
    colorClass: 'bg-yellow-50 text-yellow-500 ring-yellow-200',
  },
  {
    key: 'outOfStock',
    title: 'Out of Stock',
    icon: PackageX,
    colorClass: 'bg-gray-100 text-gray-500 ring-gray-200',
  },
  {
    key: 'runningLow',
    title: 'Running Low — Stock ≤ 10',
    icon: AlertTriangle,
    colorClass: 'bg-amber-50 text-amber-500 ring-amber-200',
  },
];

export default function Alerts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [alertData, setAlertData] = useState({
    expired: [],
    critical: [],
    expiringSoon: [],
    outOfStock: [],
    runningLow: [],
  });

  const urlSection = searchParams.get('section');

  useEffect(() => {
    let isMounted = true;

    async function loadAlerts() {
      setIsLoading(true);
      setError('');
      try {
        const res = await alertService.getAll();
        if (!isMounted) return;
        const data = res?.data ?? {};

        // Sort expired by expiry_date DESC (most recently expired first)
        const expired = [...(data.expired ?? [])].sort(
          (a, b) => new Date(b.expiry_date) - new Date(a.expiry_date),
        );

        // Sort critical by expiry_date ASC (soonest to expire first)
        const critical = [...(data.critical ?? [])].sort(
          (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date),
        );

        // Sort expiring_soon by expiry_date ASC (soonest to expire first)
        const expiringSoon = [...(data.expiring_soon ?? [])].sort(
          (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date),
        );

        // out_of_stock: no sorting needed
        const outOfStock = data.out_of_stock ?? [];

        // Sort running_low by quantity ASC (least stock first)
        const runningLow = [...(data.running_low ?? [])].sort(
          (a, b) => a.quantity - b.quantity,
        );

        setAlertData({
          expired,
          critical,
          expiringSoon,
          outOfStock,
          runningLow,
        });
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.response?.data?.message || 'Failed to load alerts.',
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAlerts();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = (key, nextOpen) => {
    if (nextOpen) {
      setSearchParams({ section: key });
    } else {
      setSearchParams({});
    }
  };

  const sectionData = useMemo(() => {
    return SECTIONS.map((section) => ({
      ...section,
      medicines: alertData[section.key] ?? [],
      isOpen: urlSection === section.key,
    }));
  }, [alertData, urlSection]);

  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold text-slate-800">Alerts</h1>

      {error ? (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        {sectionData.map((section) => (
          <AlertSection
            key={section.key}
            title={section.title}
            icon={section.icon}
            colorClass={section.colorClass}
            medicines={section.medicines}
            defaultOpen={section.isOpen}
            onToggle={(nextOpen) => handleToggle(section.key, nextOpen)}
          />
        ))}
      </div>
    </div>
  );
}
