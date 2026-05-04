import { AlertCircle, CheckCircle, Clock, PackageX, Skull, AlertTriangle } from 'lucide-react';
import { RUNNING_LOW_THRESHOLD } from '../constants';

// Thresholds must match backend logic (see alerts.js)
const CRITICAL_DAYS    = 7;
const EXPIRING_DAYS    = 30;

export class BadgeFactory {
  static create(medicine, now = new Date()) {
    if (!medicine) return null;

    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    // ── 1. Expired ────────────────────────────────────────────────────────────
    // Trust explicit backend flag first, then compute from expiry_date
    const expiry = medicine.expiry_date ? new Date(medicine.expiry_date) : null;
    const isExpired =
      medicine.is_expired ||
      medicine.expired ||
      (expiry !== null && expiry < today);

    if (isExpired) {
      return { label: 'Expired', color: 'red', icon: Skull };
    }

    // ── 2. Out of Stock ───────────────────────────────────────────────────────
    const qty = Number(medicine.quantity ?? medicine.stock ?? 0);
    if (qty === 0) {
      return { label: 'Out of Stock', color: 'red', icon: PackageX };
    }

    // ── 3. Critical — expiring within 7 days ─────────────────────────────────
    const isCritical =
      medicine.is_critical ||
      medicine.critical ||
      medicine.isCritical ||
      (expiry !== null && daysUntil(expiry, today) <= CRITICAL_DAYS);

    if (isCritical) {
      return { label: 'Critical', color: 'orange', icon: AlertCircle };
    }

    // ── 4. Expiring Soon — within 30 days ────────────────────────────────────
    const isExpiringSoon =
      medicine.is_expiring_soon ||
      medicine.expiringSoon ||
      medicine.isExpiringSoon ||
      (expiry !== null && daysUntil(expiry, today) <= EXPIRING_DAYS);

    if (isExpiringSoon) {
      return { label: 'Expiring Soon', color: 'yellow', icon: Clock };
    }

    // ── 5. Running Low ────────────────────────────────────────────────────────
    if (qty <= RUNNING_LOW_THRESHOLD) {
      return { label: 'Running Low', color: 'amber', icon: AlertTriangle };
    }

    return { label: 'Good', color: 'green', icon: CheckCircle };
  }
}

function daysUntil(date, today) {
  const ms = date.getTime() - today.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}
