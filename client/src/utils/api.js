// api.js
import axios from "axios";

const isProd = import.meta.env.MODE === "production";

const baseURL = isProd
  ? import.meta.env.VITE_SERVER_API_PROD
  : import.meta.env.VITE_SERVER_API_LOCAL;

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
