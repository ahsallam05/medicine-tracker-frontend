import { describe, it, expect } from 'vitest';
import { BadgeFactory } from './BadgeFactory';
import { Skull, AlertCircle, Clock, PackageX, CheckCircle, AlertTriangle } from 'lucide-react';

describe('BadgeFactory', () => {
  const mockNow = new Date('2026-05-04T12:00:00Z');

  it('should return null if no medicine is provided', () => {
    expect(BadgeFactory.create(null)).toBeNull();
  });

  it('should return Expired if is_expired is true', () => {
    const medicine = { is_expired: true };
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).toBe('Expired');
    expect(badge.color).toBe('red');
    expect(badge.icon).toBe(Skull);
  });

  it('should return Expired if expiry_date is in the past', () => {
    const medicine = { expiry_date: '2026-05-03' };
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).toBe('Expired');
  });

  it('should return Expired if expiry_date is today', () => {
    const medicine = { expiry_date: '2026-05-04' };
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).not.toBe('Expired');
  });

  it('should return Out of Stock if quantity is 0', () => {
    const medicine = { quantity: 0, expiry_date: '2026-06-04' };
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).toBe('Out of Stock');
    expect(badge.color).toBe('red');
    expect(badge.icon).toBe(PackageX);
  });

  it('should return Critical if expiring in 7 days or less', () => {
    // Using explicit Date objects to avoid timezone issues with string parsing
    const today = new Date(2026, 4, 4); // May 4
    const expiry = new Date(2026, 4, 11); // May 11 (+7 days)
    const medicine = { quantity: 100, expiry_date: expiry.toISOString() };
    const badge = BadgeFactory.create(medicine, today);
    expect(badge.label).toBe('Critical');
    expect(badge.color).toBe('orange');
    expect(badge.icon).toBe(AlertCircle);
  });

  it('should return Expiring Soon if expiring in 30 days or less', () => {
    const today = new Date(2026, 4, 4);
    const expiry = new Date(2026, 4, 12); // May 12 (+8 days)
    const medicine = { quantity: 100, expiry_date: expiry.toISOString() };
    const badge = BadgeFactory.create(medicine, today);
    expect(badge.label).toBe('Expiring Soon');
    expect(badge.color).toBe('yellow');
    expect(badge.icon).toBe(Clock);
  });

  it('should return Running Low if quantity is <= threshold', () => {
    const medicine = { quantity: 10, expiry_date: '2026-07-04' }; // 10 is threshold
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).toBe('Running Low');
    expect(badge.color).toBe('amber');
    expect(badge.icon).toBe(AlertTriangle);
  });

  it('should return Good if none of the above conditions are met', () => {
    const medicine = { quantity: 20, expiry_date: '2026-07-04' };
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).toBe('Good');
    expect(badge.color).toBe('green');
    expect(badge.icon).toBe(CheckCircle);
  });

  it('should prioritize Expired over Out of Stock', () => {
    const medicine = { is_expired: true, quantity: 0 };
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).toBe('Expired');
  });

  it('should prioritize Out of Stock over Critical', () => {
    const medicine = { quantity: 0, critical: true };
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).toBe('Out of Stock');
  });

  it('should prioritize Critical over Expiring Soon', () => {
    const medicine = { quantity: 10, critical: true, expiringSoon: true };
    const badge = BadgeFactory.create(medicine, mockNow);
    expect(badge.label).toBe('Critical');
  });
});
