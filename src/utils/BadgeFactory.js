/**
 * Factory Method — status badge metadata.
 * Priority: Out of Stock → Expired → Critical → Expiring Soon → Running Low → Good
 */
export default class BadgeFactory {
  static create(medicine) {
    const qty = Number(medicine?.quantity ?? 0);

    // 1. Out of Stock (highest priority)
    if (qty === 0) {
      return { label: 'Out of Stock', color: 'gray', icon: '📦' };
    }

    // Date comparisons for expiry
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (medicine?.expiry_date) {
      const expiry = new Date(medicine.expiry_date);
      expiry.setHours(0, 0, 0, 0);

      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 2. Expired
      if (diffDays < 0) {
        return { label: 'Expired', color: 'red', icon: '💀' };
      }

      // 3. Critical (within 7 days)
      if (diffDays <= 7) {
        return { label: 'Critical', color: 'orange', icon: '🔴' };
      }

      // 4. Expiring Soon (within 30 days)
      if (diffDays <= 30) {
        return { label: 'Expiring Soon', color: 'yellow', icon: '🟡' };
      }
    }

    // 5. Running Low (checked after expiry statuses)
    if (qty > 0 && qty <= 10) {
      return { label: 'Running Low', color: 'amber', icon: '⚠️' };
    }

    // 6. Good
    return { label: 'Good', color: 'green', icon: '✅' };
  }
}
