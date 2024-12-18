import axios from "axios";

import { AuthService } from "@/features/authorize";

import { useLocalStorage } from "../lib/hooks/useLocalStorage";
import { isDevelopment } from "../lib/utils";

export const SERVER_URL = isDevelopment() ? `http://localhost:7700` : "https://api.colir.net";
export const API_URL = `${SERVER_URL}/API`;

// eslint-disable-next-line react-hooks/rules-of-hooks
const { setToLocalStorage, getFromLocalStorage, removeFromLocalStorage } = useLocalStorage();

export const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${getFromLocalStorage<string>("jwtToken")}`;
  return config;
});

$api.interceptors.response.use(
  (config) => config,
  (error) => {
    // Intercept "Unauthorized (401)"
    if (error?.response?.status == 401) {
      const currentJwtToken = getFromLocalStorage<string>("jwtToken");
      const currentRefreshToken = getFromLocalStorage<string>("refreshToken");

      if (!currentJwtToken || !currentRefreshToken) {
        removeFromLocalStorage("jwtToken");
        removeFromLocalStorage("refreshToken");
        return error;
      }

      // Requesting a new JWT token along with the refresh token
      return AuthService.RefreshToken(currentJwtToken, currentRefreshToken)
        .then((response) => {
          if (!("newJwtToken" in response.data && "refreshToken" in response.data)) return;

          // Setting new JWT & refresh tokens
          setToLocalStorage("jwtToken", response.data.newJwtToken);
          setToLocalStorage("refreshToken", response.data.refreshToken);

          // Resending the request
          return $api.request(error.config).catch((e) => Promise.reject(e));
        })
        .catch((e) => {
          if (e.response?.status == 400) {
            removeFromLocalStorage("jwtToken");
            removeFromLocalStorage("refreshToken");
            window.location.href = "/";
          }

          Promise.reject(e);
        });
    }

    return Promise.reject(error);
  }
);
