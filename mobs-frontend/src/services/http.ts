import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers.Accept = "application/json";
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // opcional: deslogar e redirecionar
      // const { useAuthStore } = await import("../stores/auth");
      // useAuthStore().logout();
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
