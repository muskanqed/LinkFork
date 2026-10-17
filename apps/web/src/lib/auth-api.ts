import { apiRequest } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface MeResponse {
  success: boolean;
  data: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export const authApi = {
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout: async (): Promise<LogoutResponse> => {
    return apiRequest<LogoutResponse>('/auth/logout', {
      method: 'POST',
    });
  },

  getMe: async (): Promise<User> => {
    const response = await apiRequest<MeResponse>('/auth/me', {
      method: 'GET',
    });
    return response.data;
  },
};
