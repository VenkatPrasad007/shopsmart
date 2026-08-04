import axiosClient from './axiosClient';

export const productApi = {
  getAll: (page = 0, size = 10) =>
    axiosClient.get(`/api/products?page=${page}&size=${size}`),
  getById: (id) => axiosClient.get(`/api/products/${id}`),
  getByCategory: (categoryId, page = 0) =>
    axiosClient.get(`/api/products/category/${categoryId}?page=${page}`),
  search: (keyword, page = 0) =>
    axiosClient.get(`/api/products/search?keyword=${keyword}&page=${page}`),
  getCategories: () => axiosClient.get('/api/products/categories'),
  create: (data) => axiosClient.post('/api/products', data),
  update: (id, data) => axiosClient.put(`/api/products/${id}`, data),
  delete: (id) => axiosClient.delete(`/api/products/${id}`),
};