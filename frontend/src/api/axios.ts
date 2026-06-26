import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-system-7l0t.onrender.com/api",
});

// Attach the saved login token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;