import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
};

export const productApi = {
  getAll: (params) => api.get('/products', { params }),
  getOne: (id) => api.get(`/products/${id}`),
  getRecommended: () => api.get('/products/recommended'),
};

export const categoryApi = {
  getAll: () => api.get('/categories'),
  getOne: (id) => api.get(`/categories/${id}`),
};

export const orderApi = {
  getAll: (params) => api.get('/orders', { params }),
  getOne: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
};

export const paymentApi = {
  pay: (orderId, data) => api.post(`/payments/${orderId}/pay`, data),
  simulateQris: (orderId) => api.post(`/payments/${orderId}/simulate-qris`),
};

export const reviewApi = {
  create: (productId, data) => api.post(`/products/${productId}/reviews`, data),
};

export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  // Products
  getProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, data) => api.post(`/admin/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  // Categories
  getCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCategory: (id, data) => api.post(`/admin/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  // Orders
  getOrders: (params) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, data) => api.patch(`/admin/orders/${id}/status`, data),
  // Users
  getUsers: () => api.get('/admin/users'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // Reports
  getSalesReport: (params) => api.get('/admin/reports/sales', { params }),
  getPopularReport: () => api.get('/admin/reports/popular'),
};

export default api;
