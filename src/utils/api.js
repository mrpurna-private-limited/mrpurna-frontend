import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const FALLBACK_API_BASE = API_BASE.includes('localhost:5000') ? API_BASE.replace('localhost:5000', 'localhost:5001') : null;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('mrpurna_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => Promise.reject(error));

// REST API Helpers
export const fetchProducts = async (params = {}) => {
  try {
    const response = await api.get('/products', { params });
    return response.data;
  } catch (primaryError) {
    if (!FALLBACK_API_BASE) throw primaryError;
    const response = await axios.get(`${FALLBACK_API_BASE}/products`, { params });
    return response.data;
  }
};

export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
};

export const fetchUserProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const createRazorpayOrder = async (orderPayload) => {
  const response = await api.post('/orders/create-razorpay-order', orderPayload);
  return response.data;
};

export const verifyPayment = async (paymentPayload) => {
  const response = await api.post('/orders/verify-payment', paymentPayload);
  return response.data;
};

export const fetchOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Admin Endpoints (Protected by role check)
export const createProductAdmin = async (productData) => {
  const response = await api.post('/admin/products', productData);
  return response.data;
};

export const updateProductAdmin = async (id, productData) => {
  const response = await api.put(`/admin/products/${id}`, productData);
  return response.data;
};

export const deleteProductAdmin = async (id) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};

export const fetchAdminOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const fetchWhatsAppStatusAdmin = async () => {
  const response = await api.get('/admin/whatsapp/status');
  return response.data;
};

export const fetchUserOrders = async () => {
  const response = await api.get('/orders/user-orders');
  return response.data;
};

export const updateOrderStatusAdmin = async (id, status) => {
  const response = await api.put(`/admin/orders/${id}/status`, { order_status: status });
  return response.data;
};

export default api;
