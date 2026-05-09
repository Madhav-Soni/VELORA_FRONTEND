import axios from "axios";
import { useVeloraStore } from "../store/useVeloraStore";

export const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ── axios instance ───────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach JWT token
api.interceptors.request.use((config) => {
  const { token } = useVeloraStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: global 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useVeloraStore.getState().logout();
      // Optionally redirect or show message
    }
    return Promise.reject(error);
  }
);

// ── endpoints ────────────────────────────────────────────────────────────────
export const ENDPOINTS = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  RECOMMENDATIONS: (userId) => `/recommendations/${userId}`,
  PREFERENCES: (userId) => `/preferences/${userId}`,
  WATCHLIST: (userId) => `/watchlist/${userId}`,
  WATCHLIST_SYNC: (userId) => `/watchlist-sync/${userId}`,
  HISTORY: (userId) => `/history/${userId}`,
};

// ── public API ───────────────────────────────────────────────────────────────
export const backend = {
  // Auth
  login: (email, password) =>
    api.post(ENDPOINTS.LOGIN, { email, password }).then((res) => res.data),

  signup: (name, email, password) =>
    api.post(ENDPOINTS.SIGNUP, { name, email, password }).then((res) => res.data),

  // Recommendations
  getRecommendations: (userId) =>
    api.get(ENDPOINTS.RECOMMENDATIONS(userId)).then((res) => res.data),

  // Preferences
  getPreferences: (userId) =>
    api.get(ENDPOINTS.PREFERENCES(userId)).then((res) => res.data),

  updatePreferences: (userId, data) =>
    api.put(ENDPOINTS.PREFERENCES(userId), data).then((res) => res.data),

  // Watchlist
  getWatchlist: (userId) =>
    api.get(ENDPOINTS.WATCHLIST(userId)).then((res) => res.data),

  syncWatchlist: (userId, movieIds) =>
    api.post(ENDPOINTS.WATCHLIST_SYNC(userId), { movieIds }).then((res) => res.data),

  // History
  getWatchHistory: (userId) =>
    api.get(`/history/${userId}`).then((res) => res.data),

  addToWatchHistory: (userId, movieId) =>
    api.post(`/history/${userId}`, { movieId }).then((res) => res.data),
};
