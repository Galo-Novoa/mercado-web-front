import { authService } from '../services/authService';

// Interceptor global para agregar token a las requests
const originalFetch = window.fetch;

window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const token = authService.getToken();
  
  const headers = new Headers(init?.headers);
  
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && init?.method !== 'GET') {
    headers.set('Content-Type', 'application/json');
  }

  const config: RequestInit = {
    ...init,
    headers,
  };

  return originalFetch(input, config);
};