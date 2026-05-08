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
    const res = await fetch(`${BACKEND_URL}/recommendations/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch recommendations");
    return res.json();
  },
  updatePreferences: async (userId, data) => {
    const res = await fetch(`${BACKEND_URL}/preferences/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update preferences");
    return res.json();
  },
};
