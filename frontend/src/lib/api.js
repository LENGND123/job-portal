import axios from "axios";

function apiBase() {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (import.meta.env.DEV) return "http://localhost:8000";
  return "";
}

const api = axios.create({
  baseURL: apiBase(),
  withCredentials: true,
});

export default api;

export function fileUrl(filePath) {
  if (!filePath) return "";
  if (/^(https?:|data:|blob:)/i.test(filePath)) return filePath;
  const base = apiBase();
  if (!base) return filePath;
  return `${base}${filePath.startsWith("/") ? filePath : `/${filePath}`}`;
}

export function errorMessage(error, fallback = "Something went wrong.") {
  return error?.response?.data?.message || fallback;
}
