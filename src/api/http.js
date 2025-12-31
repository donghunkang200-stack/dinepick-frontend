import axios from "axios";

export const http = axios.create({
  baseURL: "", // vite proxy 사용 => /api로 바로 쏘면 됨
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
