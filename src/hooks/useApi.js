import { useState, useCallback, useEffect, useRef } from 'react';

const DEFAULT_TRANSFORM = (data) => data;

export function useApi(apiCall, { transform = DEFAULT_TRANSFORM, immediate = false, dependencies = [], initialData = null } = {}) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState('');
  
  const isMounted = useRef(true);
  const apiCallRef = useRef(apiCall);
  const transformRef = useRef(transform);

  useEffect(() => {
    apiCallRef.current = apiCall;
    transformRef.current = transform;
  });

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  const execute = useCallback(async (...args) => {
    if (!apiCallRef.current) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await apiCallRef.current(...args);
      if (isMounted.current) {
        const transformedData = transformRef.current(result);
        setData(transformedData);
        return transformedData;
      }
    } catch (err) {
      if (isMounted.current) {
        const message = err?.response?.data?.message || err?.message || 'An unexpected error occurred.';
        setError(message);
        throw err;
      }
    } finally {
      if (isMounted.current) { setIsLoading(false); }
    }
  }, []);

  useEffect(() => {
    if (immediate) { execute(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, ...dependencies]);

  return { data, setData, isLoading, setIsLoading, error, setError, execute };
}
