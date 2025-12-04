import axios from 'axios';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    withCredentials: true,
});

// Add request interceptor to handle errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - could dispatch logout action here
            console.error('Unauthorized access - token may have expired');
        }
        return Promise.reject(error);
    }
);

export default instance;