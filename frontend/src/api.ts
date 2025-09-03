// Centralized API utility for frontend/src
// Handles auth token, error handling, and base URL

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Simple in-memory cache for API responses
// Use unknown instead of any for better type safety
const cache = new Map<string, { data: unknown, timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds cache lifetime

/**
 * Centralized API fetch utility with authentication, error handling, and caching
 * @param endpoint API endpoint path
 * @param options Fetch options
 * @param requireAuth Whether to include auth token
 * @param useCache Whether to use cache for GET requests (default: false)
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {},
  requireAuth = true,
  useCache = false
) {
  // If GET request and cache is enabled, check cache first
  const isGet = !options.method || options.method === 'GET';
  const cacheKey = endpoint + JSON.stringify(options);
  
  if (isGet && useCache && cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_TTL) {
      return cachedData.data;
    }
    // Cache expired, remove it
    cache.delete(cacheKey);
  }

  // Authentication header setup
  const token = requireAuth ? localStorage.getItem("token") : null;
  const headers: HeadersInit = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Make API request
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Parse response
  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // Handle error responses
  if (!res.ok) {
    throw new Error(data?.error || "API error");
  }
  
  // Store in cache if it's a GET request and cache is enabled
  if (isGet && useCache) {
    cache.set(cacheKey, { data, timestamp: Date.now() });
  }
  
  return data;
}

export { API_BASE_URL };
