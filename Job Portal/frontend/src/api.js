// API Base URL — points to backend server
// When running in mobile APK (or any non-5000/5173 port), connect to PC IP
const isLocalDevPort = typeof window !== 'undefined' && 
  (window.location.port === '5000' || window.location.port === '5173');

export const API_BASE = !isLocalDevPort
  ? 'http://172.20.10.4:5000'
  : '';

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
