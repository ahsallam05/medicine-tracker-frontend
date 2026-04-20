import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, Clock, PackageX, Skull, AlertTriangle } from 'lucide-react';
import { alertService } from '../api';
import { AlertSection, Spinner } from '../components/shared';
import { useApi } from '../hooks';

const SECTIONS = [
  { key: 'expired', title: 'Expired Medicines', icon: Skull, colorClass: 'bg-red-50 text-red-600 ring-red-200' },
  { key: 'critical', title: 'Critical — Expiring in 7 Days', icon: AlertCircle, colorClass: 'bg-orange-50 text-orange-500 ring-orange-200' },
  { key: 'expiringSoon', title: 'Expiring Soon — Within 30 Days', icon: Clock, colorClass: 'bg-yellow-50 text-yellow-500 ring-yellow-200' },
  { key: 'outOfStock', title: 'Out of Stock', icon: PackageX, colorClass: 'bg-red-50 text-red-600 ring-red-200' },
  { key: 'runningLow', title: 'Running Low — Stock ≤ 10', icon: AlertTriangle, colorClass: 'bg-amber-50 text-amber-500 ring-amber-200' },
];

export default function Alerts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSection = searchParams.get('section');

  const {
    data: alertData, isLoading, error,
  } = useApi(alertService.getAll, {
    immediate: true,
    initialData: { expired: [], critical: [], expiringSoon: [], outOfStock: [], runningLow: [] },
  });

  const handleToggle = (key, nextOpen) => {
    if (nextOpen) setSearchParams({ section: key });
    else setSearchParams({});
  };

  const sectionData = useMemo(() => {
    return SECTIONS.map((section) => ({
      ...section,
      medicines: alertData[section.key] ?? [],
      isOpen: urlSection === section.key,
    }));
  }, [alertData, urlSection]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">Notifications & Alerts</h1>
      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        {sectionData.map((section) => (
          <AlertSection
            key={section.key} title={section.title} icon={section.icon}
            colorClass={section.colorClass} medicines={section.medicines}
            defaultOpen={section.isOpen} onToggle={(nextOpen) => handleToggle(section.key, nextOpen)}
          />
        ))}
      </div>
    </div>
  );
}
