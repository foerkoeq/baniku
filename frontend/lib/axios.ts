// start of frontend/lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Cek token dari berbagai storage dan cookie
        const tokenFromStorage = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        // Baca token dari cookie jika ada
        const tokenFromCookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
            
        const token = tokenFromStorage || tokenFromCookie;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Axios adding token to request');
        }

        // Remove double /api if exists
        if (config.url?.startsWith('/api/api/')) {
            config.url = config.url.replace('/api/api/', '/api/');
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Log setiap respons sukses dengan role (jika ada)
        if (response.data?.data?.user?.role) {
            console.log(`Response berhasil dengan role: ${response.data.data.user.role}`);
        }
        return response;
    },
    (error) => {
        // Handle rate limiting
        if (error.response?.status === 429) {
            console.log('Rate limit hit, using cached data if available');
            // Don't clear auth data on rate limit
            return Promise.reject(error);
        }
        
        // Handle token expiration or authentication errors
        if (error.response?.status === 401) {
            console.log('Unauthorized error, clearing auth data');
            
            // Skip clearing auth data if on login page to prevent loops
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                
                // Redirect ke login setelah delay
                setTimeout(() => {
                    window.location.href = '/auth/login';
                }, 100);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
// end of frontend/lib/axios.ts