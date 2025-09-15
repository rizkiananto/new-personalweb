// API configuration utilities
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000',
  endpoints: {
    matchJob: '/api/v1/match-job',
  },
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.baseUrl}${endpoint}`;
};

// Helper function to get default headers
export const getApiHeaders = (authToken?: string) => {
  // Use provided token or fall back to environment variable
  const token = authToken || process.env.NEXT_PUBLIC_API_KEY;
  
  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};