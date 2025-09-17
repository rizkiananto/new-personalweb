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
  
  // Debug logging to help diagnose environment variable issues
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔧 API Debug Info:', {
      hasProvidedToken: !!authToken,
      hasEnvToken: !!process.env.NEXT_PUBLIC_API_KEY,
      envToken: process.env.NEXT_PUBLIC_API_KEY ? `${process.env.NEXT_PUBLIC_API_KEY.substring(0, 10)}...` : 'undefined',
      finalToken: token ? `${token.substring(0, 10)}...` : 'undefined'
    });
  }
  
  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('⚠️ No API token found - requests may fail');
  }
  
  return headers;
};