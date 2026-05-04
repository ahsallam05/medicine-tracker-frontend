import { describe, it, expect } from 'vitest';
import { parseApiError } from './parseApiError';

describe('parseApiError', () => {
  it('should return message from response data', () => {
    const err = { response: { data: { message: 'Custom error' } } };
    expect(parseApiError(err)).toBe('Custom error');
  });

  it('should join multiple error messages from object', () => {
    const err = { response: { data: { errors: { name: 'Name required', qty: 'Must be > 0' } } } };
    expect(parseApiError(err)).toBe('Name required, Must be > 0');
  });

  it('should handle details object', () => {
    const err = { response: { data: { details: { code: 'Invalid code' } } } };
    expect(parseApiError(err)).toBe('Invalid code');
  });

  it('should return error string if message is missing', () => {
    const err = { response: { data: { error: 'Simple error string' } } };
    expect(parseApiError(err)).toBe('Simple error string');
  });

  it('should return raw error message if no response data', () => {
    const err = { message: 'Network Failure' };
    expect(parseApiError(err)).toBe('Network Failure');
  });

  it('should return fallback if nothing else is available', () => {
    expect(parseApiError({}, 'Global fallback')).toBe('Global fallback');
  });
});
