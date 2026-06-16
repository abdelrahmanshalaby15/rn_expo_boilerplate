import { env } from '@/config/env';

/**
 * Typed HTTP client wired to the active environment's `apiUrl`. Use this for all
 * network calls (never call `fetch` or read `env`/`process.env` ad hoc) so base
 * URL, headers, and error handling stay in one place.
 */

/** Thrown on a non-2xx response. Carries the status and parsed body for the UI. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown, message?: string) {
    super(message ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = new URL(path, env.apiUrl).toString();

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      // Inject an auth token here when you add authentication, e.g.:
      // ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Parse the body once; tolerate empty (204) responses.
  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!response.ok) {
    throw new ApiError(response.status, data);
  }

  return data as T;
}

function withBody(method: string) {
  return <T>(path: string, body?: unknown, options: RequestInit = {}) =>
    apiRequest<T>(path, {
      ...options,
      method,
      body: body === undefined ? options.body : JSON.stringify(body),
    });
}

export const apiClient = {
  get: <T>(path: string, options?: RequestInit) => apiRequest<T>(path, { ...options, method: 'GET' }),
  post: withBody('POST'),
  put: withBody('PUT'),
  patch: withBody('PATCH'),
  delete: <T>(path: string, options?: RequestInit) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};
