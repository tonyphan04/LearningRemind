// Centralized API utility for frontend/src
// Handles auth token, error handling, and base URL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true
) {
  const token = requireAuth ? localStorage.getItem("token") : null;
  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error(data?.error || "API error");
  }
  return data;
}

export { API_BASE_URL };
