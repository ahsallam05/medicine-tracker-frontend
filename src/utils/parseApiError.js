export function parseApiError(err, fallback = 'An unexpected error occurred.') {
  const data = err?.response?.data;
  if (data?.errors || data?.details) {
    return Object.values(data.errors ?? data.details).join(', ');
  }
  return data?.message || data?.error || err?.message || fallback;
}
