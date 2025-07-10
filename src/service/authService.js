import axios from 'axios'
const BASE_URL="http://localhost:8080/api";

const api=axios.create({
    baseURL:BASE_URL,
    headers:{
        'Content-Type':'application/json'
    },
    withCredentials:true  //Important for handling cookie cross origin
})

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//Response interceptor for handling API responses and errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Handle specific HTTP error codes
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized access
                    authService.logout();
                    window.location.href='/login'
                    break;
                case 403:
                    // Handle forbidden access
                    console.error("Access forbidden");
                    break;
                case 404:
                    // Handle not found
                    console.error("Resource not found");
                    break;
                case 500:
                    // Handle server errors
                    console.error("Server error");
                    break;
                default:
                    console.error("An error occurred:", error.response.data);
            }
        }
        else if(error.request){
            //request made but no response received
            console.error("No response received from the server",error.request);
        }else{
            console.error("Error in setting up the request", error.message);
        }
        return Promise.reject(error);
    }
);

// Auth service methods
const authService = {
    signupNormalUser: async (username,email,password) => {
        try {
            const response = await api.post('/auth/registernormaluser', {
                username,
                email,
                password
            });
            return response.data;
        } catch (error) {
            console.error
            throw error;
        }
    },
    login: async (username,password) => {
        try {
            const response = await api.post('/auth/login',{username,password} );
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            //fetch current user details
            const user=await authService.getCurrentUser();
            return response.data;
        } catch (error) {
            throw error;
        }
    },


    getCurrentUser: async () => {
        try {
        const response = await api.get('/auth/getcurrentuser');
        // Store userDto in localStorage for quick access
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
        } catch (error) {
            console.error("Error fetching current user:", error);
           //if unauthorized, redirect to login
            if(error.response && error.response.status === 401) {
               await authService.logout();
            }
            return null;
        }
    },
    //get current user details from localStorage
    getCurrentUserFromLocalStorage: () => {
        const user = localStorage.getItem('user');
        try{
        return user ? JSON.parse(user) : null;
        }catch(error){
            console.error("Error parsing user data from localStorage:", error);
            return null;
        }
    },

      logout: async () => {
        try {
            // call the logout API
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
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
    }
};

export { api as default, authService };

