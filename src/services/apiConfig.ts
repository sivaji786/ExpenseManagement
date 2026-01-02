import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add any auth tokens
api.interceptors.request.use(
    (config) => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            const userData = JSON.parse(user);
            // Add user_id to requests if needed
            if (config.method === 'get' && !config.params) {
                config.params = {};
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);

            if (error.response.status === 401) {
                // Unauthorized - clear user session
                localStorage.removeItem('currentUser');
                window.location.href = '/';
            }
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.request);
        } else {
            // Error in request setup
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default api;
