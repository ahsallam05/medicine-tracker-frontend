import { AlertCircle, Clock, PackageX, Skull, AlertTriangle } from 'lucide-react';

export const ALERT_SECTIONS = [
  { key: 'expired',      title: 'Expired Medicines',               icon: Skull,         colorClass: 'bg-red-50 text-red-600 ring-red-200' },
  { key: 'critical',     title: 'Critical — Expiring in 7 Days',   icon: AlertCircle,   colorClass: 'bg-orange-50 text-orange-500 ring-orange-200' },
  { key: 'expiringSoon', title: 'Expiring Soon — Within 30 Days',  icon: Clock,         colorClass: 'bg-yellow-50 text-yellow-500 ring-yellow-200' },
  { key: 'outOfStock',   title: 'Out of Stock',                    icon: PackageX,      colorClass: 'bg-red-50 text-red-600 ring-red-200' },
  { key: 'runningLow',   title: 'Running Low — Stock ≤ 10',        icon: AlertTriangle, colorClass: 'bg-amber-50 text-amber-500 ring-amber-200' },
];
