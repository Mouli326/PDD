// API Base URL — points to backend server
// When running on a physical device (APK), this must be your PC's local IP
// Your current PC IP: 172.20.10.4 (Wi-Fi)
const isCapacitorApp = window.location.protocol !== 'http:' || window.Capacitor;

export const API_BASE = isCapacitorApp
  ? 'http://172.20.10.4:5000'
  : '';  // empty = use relative URLs (for dev server with proxy)

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
