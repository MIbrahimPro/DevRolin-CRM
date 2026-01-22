import axios from 'axios';

// Validate Environment Variable
const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    const errorMsg = "CRITICAL ERROR: VITE_API_URL is not defined in your .env file.";
    console.error(errorMsg);
    throw new Error(errorMsg);
}

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;