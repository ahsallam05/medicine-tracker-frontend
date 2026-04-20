import { useState, useCallback } from 'react';

export function useFilters() {
  const [status, setStatus] = useState('');
  const [category, setCategory] = useState('All');

  const resetFilters = useCallback(() => {
    setStatus('');
    setCategory('All');
  }, []);

  const hasActiveFilters = status || category !== 'All';

  const getApiParams = useCallback(() => {
    const params = {};
    if (status) {
      params.status = status;
      // Add sort parameter based on status
      switch (status) {
        case 'Expired':
          params.sortBy = 'expiry_date';
          params.order = 'desc'; // Recently expired first
          break;
        case 'Expiring Soon':
        case 'Critical':
          params.sortBy = 'expiry_date';
          params.order = 'asc'; // Expiring first
          break;
        case 'Running Low':
          params.sortBy = 'quantity';
          params.order = 'asc'; // Least quantity first
          break;
        case 'Out of Stock':
          params.sortBy = 'created_at';
          params.order = 'desc'; // Recently added first
          break;
        default:
          params.sortBy = 'created_at';
          params.order = 'desc';
          break;
      }
    }
    if (category && category !== 'All') params.category = category;
    return params;
  }, [status, category]);

  return {
    status,
    setStatus,
    category,
    setCategory,
    resetFilters,
    hasActiveFilters,
    getApiParams,
  };
}
