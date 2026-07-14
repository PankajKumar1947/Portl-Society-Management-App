import axios from "axios";
import ApiErrorHandler from "./api-error-handler";

let accessToken: string | null = null;
let refreshToken: string | null = null;
let onTokenRefresh:
  | ((data: { accessToken: string; refreshToken: string }) => void)
  | null = null;
let onAuthError: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const setRefreshToken = (token: string | null) => {
  refreshToken = token;
};

export const setOnTokenRefresh = (
  callback: (data: { accessToken: string; refreshToken: string }) => void,
) => {
  onTokenRefresh = callback;
};

export const setOnAuthError = (callback: () => void) => {
  onAuthError = callback;
};

export const apiClient = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL,
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      !originalRequest._retry &&
      refreshToken &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data;

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        if (onTokenRefresh) {
          onTokenRefresh({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, we should logout or handle it in the context
        if (onAuthError) {
          onAuthError();
        }
        return Promise.reject(refreshError);
      }
    }

    if (axios.isAxiosError(error)) {
      return Promise.reject(ApiErrorHandler.handle(error));
    }
    return Promise.reject(error);
  },
);
