const RAW_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.weli-ml.com';

function sanitizeBaseUrl(url: string): string {
  let cleaned = url.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned.replace(/\/+$/, '');
}

export const API_BASE_URL = sanitizeBaseUrl(RAW_BASE_URL);
export const API_HOST = API_BASE_URL.replace(/^https?:\/\//, '');

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const targetUrl = `${API_BASE_URL}${cleanPath}`;

  let response: Response;
  try {
    response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Erreur de connexion réseau.';
    throw new ApiError(
      `Impossible de joindre le serveur (${targetUrl}). Vérifiez votre connexion internet. (${message})`,
      0
    );
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    throw new ApiError(formatApiError(payload, response.status), response.status);
  }

  return payload as T;
}

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function formatApiError(payload: unknown, status: number): string {
  if (payload && typeof payload === 'object' && 'detail' in payload) {
    const detail = (payload as { detail: unknown }).detail;
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => {
          if (item && typeof item === 'object' && 'msg' in item) {
            return String((item as { msg: unknown }).msg);
          }
          return null;
        })
        .filter(Boolean);
      if (messages.length) return messages.join('\n');
    }
  }

  if (typeof payload === 'string' && payload.trim()) return payload;
  return `La requête a échoué (${status}).`;
}
