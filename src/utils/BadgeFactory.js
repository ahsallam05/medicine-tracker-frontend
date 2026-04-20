import { Skull, AlertCircle, Clock, PackageX, AlertTriangle, CheckCircle } from 'lucide-react';

export class BadgeFactory {
  static create(medicine) {
    if (!medicine) return this._getGoodBadge();

    const isExpired = medicine.is_expired || (medicine.expiry_date && new Date(medicine.expiry_date) < new Date());
    if (isExpired) return { label: 'Expired', color: 'red', icon: Skull };

    if (medicine.is_critical) return { label: 'Critical', color: 'orange', icon: AlertCircle };
    if (medicine.is_expiring_soon) return { label: 'Expiring Soon', color: 'yellow', icon: Clock };
    
    // Unifying Out of Stock and Expired as RED (Critical Inventory)
    if (medicine.quantity === 0) return { label: 'Out of Stock', color: 'red', icon: PackageX };
    
    // Unifying Running Low as AMBER
    if (medicine.quantity <= 10) return { label: 'Running Low', color: 'amber', icon: AlertTriangle };

    return this._getGoodBadge();
  }

  static _getGoodBadge() {
    return { label: 'Good', color: 'green', icon: CheckCircle };
  }
}
