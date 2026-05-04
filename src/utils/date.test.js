import { describe, it, expect } from 'vitest';
import { formatDate, toInputDate } from './date';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format ISO string to en-GB locale', () => {
      // 2026-05-04 -> 04/05/2026
      expect(formatDate('2026-05-04')).toBe('04/05/2026');
    });

    it('should return dash for empty values', () => {
      expect(formatDate(null)).toBe('—');
      expect(formatDate('')).toBe('—');
    });

    it('should return dash for invalid dates', () => {
      expect(formatDate('invalid')).toBe('—');
    });
  });

  describe('toInputDate', () => {
    it('should format date to YYYY-MM-DD for input fields', () => {
      expect(toInputDate('2026-05-04T12:00:00Z')).toBe('2026-05-04');
    });

    it('should return empty string for falsy values', () => {
      expect(toInputDate(null)).toBe('');
      expect(toInputDate('')).toBe('');
    });

    it('should return empty string for invalid dates', () => {
      expect(toInputDate('garbage')).toBe('');
    });
  });
});
