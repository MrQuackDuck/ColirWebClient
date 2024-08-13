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

export default $api;