import axios from "axios";
const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: baseURL || "http://localhost:8080/",
  headers: {
    Accept: "application/json",
    "Content-type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
