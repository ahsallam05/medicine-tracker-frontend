import { AlertCircle, CheckCircle, Clock, PackageX, Skull, AlertTriangle } from 'lucide-react';
import { RUNNING_LOW_THRESHOLD } from '../constants';

export class BadgeFactory {
  static create(medicine, now = new Date()) {
    if (!medicine) return null;

    const isExpired =
      medicine.is_expired ||
      (medicine.expiry_date && new Date(medicine.expiry_date) < now);

    if (isExpired) {
      return {
        label: 'Expired',
        color: 'red',
        icon: Skull,
      };
    }

    const isCritical = medicine.is_critical || medicine.critical || medicine.isCritical;
    if (isCritical) {
      return {
        label: 'Critical',
        color: 'orange',
        icon: AlertCircle,
      };
    }

    const isExpiringSoon = medicine.is_expiring_soon || medicine.expiringSoon || medicine.isExpiringSoon;
    if (isExpiringSoon) {
      return {
        label: 'Expiring Soon',
        color: 'yellow',
        icon: Clock,
      };
    }

    if (medicine.quantity === 0) {
      return {
        label: 'Out of Stock',
        color: 'red',
        icon: PackageX,
      };
    }

    if (medicine.quantity <= RUNNING_LOW_THRESHOLD) {
      return {
        label: 'Running Low',
        color: 'amber',
        icon: AlertTriangle,
      };
    }

    return BadgeFactory._getGoodBadge();
  }

  static _getGoodBadge() {
    return {
      label: 'Good',
      color: 'green',
      icon: CheckCircle,
    };
  }
}
