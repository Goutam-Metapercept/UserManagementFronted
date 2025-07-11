import axios from 'axios';

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important for handling cookie cross-origin
});

// Request interceptor for adding auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          authService.logout();
          window.location.href = '/login';
          break;
        case 403:
          console.error("Access forbidden");
          break;
        case 404:
          console.error("Resource not found");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.error("An error occurred:", error.response.data);
      }
    } else if (error.request) {
      console.error("No response received from server:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

// Auth service methods
const authService = {
  signupNormalUser: async (username, email, password) => {
    try {
      const response = await api.post('/auth/registernormaluser', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/getcurrentuser');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      if (error.response && error.response.status === 401) {
        await authService.logout();
      }
      return null;
    }
  },

  getCurrentUserFromLocalStorage: () => {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  isAuthenticated: async () => {
    try {
      const user = authService.getCurrentUserFromLocalStorage();
      return user !== null;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put(`/users/updateuser/${userData.id}`, userData);
      const updatedUser = response.data;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await api.get('/users/getallusers');
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/users/deleteuser/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
  changePassword:async(currentPassword, newPassword,confirmPassword) => {
    try{
        const currentUser = authService.getCurrentUser()
        if(!currentUser || !currentUser.id) {
            throw new Error("User not found");
        }
        const response = await api.put(`/users/changepassword/${currentUser.id}`, {
            currentPassword,
            newPassword,
            confirmPassword
        });
        return response.data;
        }catch(error){
            console.error("Error changing password:", error);
            throw error;
        }
    }
};

export { api as default, authService };
