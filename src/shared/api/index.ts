import AuthService from '@/features/authorize/lib/AuthService';
import axios from 'axios';

export const API_URL = `http://localhost:7700/API`;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("jwtToken")}`;
  config.headers['Content-Type'] = "application/json";
  return config;
});

$api.interceptors.response.use((config) => config,
  error => {
  // Intercept "Unauthorized (401)"
  if (error.response.status == 401) {
    let currentJwtToken = localStorage.getItem("jwtToken");
    let currentRefreshToken = localStorage.getItem("refreshToken");

    if (!currentJwtToken || !currentRefreshToken) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("refreshToken");
      return error;
    }

    // Requesting a new JWT token along with the refresh token
    return AuthService.RefreshToken(currentJwtToken, currentRefreshToken)
      .then(response => {
        if (!('newJwtToken' in response.data && 'refreshToken' in response.data)) return; 

        // Setting new JWT & refresh tokens
        localStorage.setItem("jwtToken", response.data.newJwtToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);

        // Resending the request
        return $api.request(error.config)
          .catch((e) => Promise.reject(e));
      })
      .catch((e) => Promise.reject(e));
  }

  return Promise.reject(error);
});

export default $api;