import { useCineStore } from "../store/useCineStore";

export const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

// ── helper ──────────────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const { token } = useCineStore.getState();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BACKEND_URL}${path}`, { ...options, headers });

  // Global 401 handler — token expired or invalid
  if (res.status === 401) {
    useCineStore.getState().logout();
    // Let the caller handle the rejection; App router will redirect on logout
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }

  return res.json();
}

// ── public API ───────────────────────────────────────────────────────────────
export const backend = {
  login: (email, password) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name, email, password) =>
    request("/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  getRecommendations: (userId) => request(`/recommendations/${userId}`),

  updatePreferences: (userId, data) =>
    request(`/preferences/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getWatchlist: (userId) => request(`/watchlist/${userId}`),

  syncWatchlist: (userId, movieIds) =>
    request(`/watchlist-sync/${userId}`, {
      method: "POST",
      body: JSON.stringify({ movieIds }),
    }),

  addToWatchHistory: (userId, movieId) =>
    request(`/watched/${userId}`, {
      method: "POST",
      body: JSON.stringify({ movieId }),
    }),
};
