import { apiRequest } from "./api";

export interface UrlItem {
  id: string;
  userId?: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UrlWithClicks extends UrlItem {
  _count?: {
    clicks: number;
  };
}

export interface CreateUrlPayload {
  originalUrl: string;
}

export interface UpdateUrlPayload {
  originalUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DeleteUrlResponseData {
  id: string;
  originalUrl: string;
  shortCode: string;
}

export const SHORT_URL_BASE =
  process.env.NEXT_PUBLIC_SHORT_URL_BASE || "http://localhost:5000";

export function formatShortUrl(shortCode: string): string {
  const base = SHORT_URL_BASE.replace(/\/+$/, "");
  return `${base}/${shortCode}`;
}

export const urlsApi = {
  getUrls: async (): Promise<UrlItem[]> => {
    const response = await apiRequest<ApiResponse<UrlItem[]>>("/urls", {
      method: "GET",
    });
    return response.data;
  },

  getUrlById: async (id: string): Promise<UrlItem> => {
    const response = await apiRequest<ApiResponse<UrlItem>>(`/urls/${id}`, {
      method: "GET",
    });
    return response.data;
  },

  createUrl: async (payload: CreateUrlPayload): Promise<UrlItem> => {
    const response = await apiRequest<ApiResponse<UrlItem>>("/urls/createUrl", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  updateUrl: async (id: string, payload: UpdateUrlPayload): Promise<UrlItem> => {
    const response = await apiRequest<ApiResponse<UrlItem>>(`/urls/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return response.data;
  },

  deleteUrl: async (id: string): Promise<DeleteUrlResponseData> => {
    const response = await apiRequest<ApiResponse<DeleteUrlResponseData>>(`/urls/${id}`, {
      method: "DELETE",
    });
    return response.data;
  },

  getClicksByUrlId: async (urlId: string = "all"): Promise<UrlWithClicks[]> => {
    const response = await apiRequest<ApiResponse<UrlWithClicks[]>>(`/clicks/${urlId}`, {
      method: "GET",
    });
    return response.data;
  },
};
