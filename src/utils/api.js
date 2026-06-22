const API_BASE = import.meta.env.VITE_API_URL;

export function getAdminHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return {
    "Content-Type": "application/json",
    "x-user-id": String(user.id || ""),
  };
}

export function adminFetch(path, options = {}) {
  return fetch(`${API_BASE}/admin${path}`, {
    ...options,
    headers: {
      ...getAdminHeaders(),
      ...options.headers,
    },
  });
}
