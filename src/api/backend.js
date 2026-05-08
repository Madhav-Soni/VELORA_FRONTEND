import { useCineStore } from "../store/useCineStore";

export const BACKEND_URL = "http://localhost:3000/api";

export const backend = {
  login: async (email, password) => {
    const res = await fetch(`${BACKEND_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
  },
  signup: async (name, email, password) => {
    const res = await fetch(`${BACKEND_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) throw new Error("Signup failed");
    return res.json();
  },
  getRecommendations: async (userId) => {
    const { token } = useCineStore.getState();
    const res = await fetch(`${BACKEND_URL}/recommendations/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch recommendations");
    return res.json();
  },
  updatePreferences: async (userId, data) => {
    const { token } = useCineStore.getState();
    const res = await fetch(`${BACKEND_URL}/preferences/${userId}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update preferences");
    return res.json();
  },
  getWatchlist: async (userId) => {
    const { token } = useCineStore.getState();
    const res = await fetch(`${BACKEND_URL}/watchlist/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch watchlist");
    return res.json();
  },
  syncWatchlist: async (userId, movieIds) => {
    const { token } = useCineStore.getState();
    const res = await fetch(`${BACKEND_URL}/watchlist-sync/${userId}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ movieIds }),
    });
    if (!res.ok) throw new Error("Failed to sync watchlist");
    return res.json();
  },
  addToWatchHistory: async (userId, movieId) => {
    const { token } = useCineStore.getState();
    const res = await fetch(`${BACKEND_URL}/watched/${userId}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ movieId }),
    });
    if (!res.ok) throw new Error("Failed to update watch history");
    return res.json();
  },
};
