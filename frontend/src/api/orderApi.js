import axiosClient from './axiosClient';

export const orderApi = {
  // Cart
  addToCart: (data) => axiosClient.post('/api/orders/cart', data),
  getCart: () => axiosClient.get('/api/orders/cart'),
  removeFromCart: (itemId) => axiosClient.delete(`/api/orders/cart/${itemId}`),
  clearCart: () => axiosClient.delete('/api/orders/cart'),

  // Orders
  checkout: (data) => axiosClient.post('/api/orders/checkout', data),
  getMyOrders: () => axiosClient.get('/api/orders'),
  getOrderById: (id) => axiosClient.get(`/api/orders/${id}`),
};