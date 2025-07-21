// src/service/authService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized (redirect to login and clear local storage)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  signupNormalUser: async (username, email, password) => {
    const response = await api.post('/auth/registernormaluser', { username, email, password });
    return response.data;
  },

  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    const { jwtToken, userDTO } = response.data;
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userDTO));
    return userDTO;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/getcurrentuser');
    return response.data;
  },

  getCurrentUserFromLocalStorage: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  updateProfile: async (userData) => {
    const response = await api.put(`/users/update/${userData.id}`, userData);
    localStorage.setItem('user', JSON.stringify(response.data));
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/users/all');
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await api.delete(`/users/delete/${userId}`);
    return response.data;
  },

  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    const currentUser = authService.getCurrentUserFromLocalStorage();
    if (!currentUser?.id) throw new Error('User not found');
    const response = await api.put(`/users/changepassword/${currentUser.id}`, {
      currentPassword,
      newPassword,
      confirmPassword,
    });
    return response.data;
  },

  getUserById: async (userId) => {
    const response = await api.get(`/users/getuserbyid/${userId}`);
    return response.data;
  },

  getUserByUsername: async (username) => {
    const response = await api.get(`/users/getuserbyusername/${username}`);
    return response.data;
  },
};

export { api as default, authService };
