import axios from 'axios';

// Change this if your Spring Boot backend runs elsewhere
const BASE_URL = 'http://localhost:8080/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the JWT to every request automatically once the user is logged in
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cyberguard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token expires / is rejected, bounce back to login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cyberguard_token');
      localStorage.removeItem('cyberguard_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
