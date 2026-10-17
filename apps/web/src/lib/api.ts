const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

function parseErrorMessage(message: unknown): string {
  if (typeof message !== 'string') {
    if (message && typeof message === 'object' && 'message' in message) {
      return String((message as any).message);
    }
    return 'An error occurred';
  }

  try {
    const parsed = JSON.parse(message);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const messages = parsed
        .map((item: any) => item?.message)
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join('. ');
      }
    }
  } catch {
    // Not JSON, return original string
  }

  return message;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const rawMessage = data?.message || response.statusText || 'An error occurred';
    const formattedMessage = parseErrorMessage(rawMessage);
    throw new ApiError(formattedMessage, response.status, data);
  }

  return data as T;
}
