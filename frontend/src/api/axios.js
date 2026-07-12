import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const updateShippingAddress = (data) => API.post('/auth/updateShippingAddress', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProductById = (id) => API.get(`/products/${id}`);
// Admin - Products
export const createProduct = (data) =>
  API.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (id, data) =>
  API.put(`/products/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteProduct = (id) => API.delete(`/products/${id}`);


// Cart (local state driven, but can sync with backend if needed)
export const getUserCart = () => API.get('/cart');
export const updateCart = (data) => API.post('/cart', data);

// Orders
export const placeOrder = (data) => API.post('/orders', data);
export const getUserOrders = () => API.get('/orders/user');
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (id, data) =>
  API.put(`/orders/${id}/status`, data);

export const getDashboardStats = () => API.get('/admin/stats');

export default API;

