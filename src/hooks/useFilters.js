import { useState, useCallback } from 'react';

export function useFilters() {
  const [category, setCategory] = useState('All');

  const resetFilters = useCallback(() => { setCategory('All'); }, []);

  const getApiParams = useCallback(() => {
    const params = { sortBy: 'created_at', order: 'desc' };
    if (category && category !== 'All') params.category = category;
    return params;
  }, [category]);

  return { category, setCategory, resetFilters, hasActiveFilters: category !== 'All', getApiParams };
}
