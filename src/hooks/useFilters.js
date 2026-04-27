import { useState, useCallback } from 'react';

export function useFilters() {
  const [category, setCategory] = useState('All');

  const getApiParams = useCallback(() => {
    const params = {};
    if (category && category !== 'All') params.category = category;
    return params;
  }, [category]);

  return { category, setCategory, getApiParams };
}
