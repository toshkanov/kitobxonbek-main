import axios, { AxiosError, AxiosInstance } from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let pendingQueue: Array<(value: unknown) => void> = [];

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
}

api.interceptors.request.use((config) => {
  const token = getCookie("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    const skipRefreshUrls = [
      "/login/",
      "/register/",
      "/token/refresh/",
    ];

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !skipRefreshUrls.some((url) => originalRequest.url?.includes(url))
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push(() => resolve(api(originalRequest)));
        });
      }

      isRefreshing = true;
      try {
        const refreshToken = getCookie("refresh_token");
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post<{ access: string }>(
          `${API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken }
        );

        setCookie("access_token", data.access, 1);

        pendingQueue.forEach((cb) => cb(undefined));
        pendingQueue = [];
        return api(originalRequest);
      } catch (refreshError) {
        removeCookie("access_token");
        removeCookie("refresh_token");
        pendingQueue = [];
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export function setAuthTokens(access: string, refresh: string) {
  setCookie("access_token", access, 1);
  setCookie("refresh_token", refresh, 7);
}

export function clearAuthTokens() {
  removeCookie("access_token");
  removeCookie("refresh_token");
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function unwrapAxiosError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return new ApiError(
      error.message,
      error.response?.status ?? 0,
      error.response?.data,
    );
  }
  return new ApiError("Unknown error", 0);
}
