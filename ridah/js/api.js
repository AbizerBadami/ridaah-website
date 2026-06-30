// ============================================================
// api.js – Centralised API layer for Ridah e-commerce
// Configure API_BASE and WHATSAPP_NUMBER before deployment
// ============================================================

const API_BASE = 'http://localhost:3000'; // ← Change this
const WHATSAPP_NUMBER = '+917498754157';          // ← Change this (country code + number, no +)

// ────────────────────────────────────────────────────────────
// Token helpers
// ────────────────────────────────────────────────────────────
const Auth = {
  getToken: () => localStorage.getItem('ridah_token'),
  setToken: (t) => localStorage.setItem('ridah_token', t),
  clearToken: () => localStorage.removeItem('ridah_token'),
  isLoggedIn: () => !!localStorage.getItem('ridah_token'),
  getUser: () => JSON.parse(localStorage.getItem('ridah_user') || 'null'),
  setUser: (u) => localStorage.setItem('ridah_user', JSON.stringify(u)),
  clearUser: () => localStorage.removeItem('ridah_user'),
  logout: () => {
    Auth.clearToken();
    Auth.clearUser();
    window.location.href = '/index.html';
  }
};

// ────────────────────────────────────────────────────────────
// Core fetch wrapper
// ────────────────────────────────────────────────────────────
async function apiFetch(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = Auth.getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (res.status === 401) {
      Auth.logout();
      return null;
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
    return data;
  } catch (err) {
    console.error(`[API] ${endpoint}:`, err.message);
    throw err;
  }
}

// ────────────────────────────────────────────────────────────
// Endpoint wrappers
// ────────────────────────────────────────────────────────────
const API = {
  // Products
  getProducts: (params = {}) => apiFetch('/api/products?' + new URLSearchParams(params)),
  getProduct: (id) => apiFetch(`/api/products/${id}`),

  // Auth
  login: (body) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  // User
  getProfile: () => apiFetch('/api/user/profile'),
  updateProfile: (body) => apiFetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getOrders: () => apiFetch('/api/orders/user'),

  // Cart (server-side sync for logged-in users)
  syncCart: (body) => apiFetch('/api/cart', { method: 'POST', body: JSON.stringify(body) }),

  // Custom Rida
  getFabrics: () => apiFetch('/api/fabrics'),
  getColors: () => apiFetch('/api/colors'),
  placeCustomOrder: (body) => apiFetch('/api/orders/custom', { method: 'POST', body: JSON.stringify(body) }),

  // Orders
  calculateOrder: (body) => apiFetch('/api/orders/calculate', { method: 'POST', body: JSON.stringify(body) }),
  placeOrder: (body) => apiFetch('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  getOrderStatus: (id) => apiFetch(`/api/orders/${id}/status`),
  getOrderTracking: (id) => apiFetch(`/api/orders/${id}/tracking`),

  // Payment
  generateQR: (body) => apiFetch('/api/payment/generate-qr', { method: 'POST', body: JSON.stringify(body) }),
  getInvoice: (id) => apiFetch(`/api/invoices/${id}`),

  // Chat
  sendMessage: (body) => apiFetch('/api/chat/send', { method: 'POST', body: JSON.stringify(body) }),
  getChatHistory: (sessionId) => apiFetch(`/api/chat/history?sessionId=${sessionId}`),
};
