import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public API endpoints
export const publicAPI = {
  getCategories: () => api.get('/categories'),
  getComponents: (skip?: number, limit?: number) =>
    api.get('/components', { params: { skip, limit } }),
  getComponentsByCategory: (categoryName: string) =>
    api.get(`/categories/${categoryName}/components`),
  getComponentDetail: (componentId: number) =>
    api.get(`/components/${componentId}`),
};

// Auth endpoints
export const authAPI = {
  signup: (data: { username: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  login: (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return api.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      transformRequest: [(data) => data], // Don't transform the data
    });
  },
  getMe: () => api.get('/auth/me'),
};

// Admin API endpoints
export const adminAPI = {
  createComponent: (data: {
    title: string;
    use_case: string;
    category: string;
  }) => api.post('/admin/components', data),
  listComponents: (skip?: number, limit?: number) =>
    api.get('/admin/components', { params: { skip, limit } }),
  getComponent: (componentId: number) =>
    api.get(`/admin/components/${componentId}`),
  updateComponent: (
    componentId: number,
    data: {
      title?: string;
      use_case?: string;
      category?: string;
    }
  ) => api.put(`/admin/components/${componentId}`, data),
  deleteComponent: (componentId: number) =>
    api.delete(`/admin/components/${componentId}`),
  createSnippet: (
    componentId: number,
    data: {
      filename: string;
      language: string;
      code: string;
    }
  ) => api.post(`/admin/components/${componentId}/snippets`, data),
  updateSnippet: (
    snippetId: number,
    data: {
      filename?: string;
      language?: string;
      code?: string;
    }
  ) => api.put(`/admin/snippets/${snippetId}`, data),
  deleteSnippet: (snippetId: number) =>
    api.delete(`/admin/snippets/${snippetId}`),
};

export default api;
