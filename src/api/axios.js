import axios from 'axios';

/**
 * Chain of Responsibility — request handlers (order: attach token → log).
 */
export function attachTokenHandler(config) {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export function logRequestHandler(config) {
  if (import.meta.env.DEV) {
    const method = config.method?.toUpperCase() ?? 'GET';
    const url = config.baseURL ? `${config.baseURL}${config.url ?? ''}` : config.url;
    console.info(`[API] ${method}`, url);
  }
  return config;
}

/**
 * Chain of Responsibility — response handlers.
 */
export function successHandler(response) {
  return response;
}

export function unauthorizedHandler(error) {
  if (error?.response?.status === 401) {
    const url = error.config?.url ?? '';
    if (!url.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  return Promise.reject(error);
}

export function forbiddenHandler(error) {
  if (error?.response?.status === 403 && import.meta.env.DEV) {
    console.warn('[API] Forbidden', error.config?.url);
  }
  return Promise.reject(error);
}

export function errorHandler(error) {
  return Promise.reject(error);
}

class HttpClient {
  static #instance = null;

  static getInstance() {
    if (!HttpClient.#instance) {
      const client = axios.create({
        baseURL: import.meta.env.VITE_API_URL ?? '',
        headers: { 'Content-Type': 'application/json' },
      });

      client.interceptors.request.use(
        (config) => logRequestHandler(attachTokenHandler(config)),
        (error) => Promise.reject(error),
      );

      client.interceptors.response.use(
        (response) => successHandler(response),
        (error) =>
          unauthorizedHandler(error)
            .catch(forbiddenHandler)
            .catch(errorHandler),
      );

      HttpClient.#instance = client;
    }
    return HttpClient.#instance;
  }
}

export default HttpClient.getInstance();
