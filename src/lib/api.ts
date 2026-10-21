const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;

// The Render API is retired — old builds (e.g. the Netlify site, still reached while DNS
// propagates) may carry its URL, so send them to the Vercel API instead
const envApiUrl = rawApiUrl?.includes('.onrender.com')
  ? 'https://harv-dreams-api.vercel.app'
  : rawApiUrl;

/** Same-origin on Render (combined deploy); override with VITE_API_URL for split deploy */
export const API_BASE =
  envApiUrl && envApiUrl.length > 0
    ? envApiUrl
    : typeof window !== 'undefined'
      ? ''
      : 'http://localhost:5000';

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const { token, headers, ...rest } = options;
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data.message || data.errors?.[0]?.msg || 'Something went wrong';
    throw new Error(message);
  }
  return data as T;
}
