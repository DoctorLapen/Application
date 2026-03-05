import axios from "axios";
import { store } from "../store/store";
import { logout } from "../features/auth/authSlice";
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

 const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  res => res,
  err => {

    const status = err.response?.status
    const url = err.config?.url
    if (status === 401 && !url?.includes("/login")) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);
export default api;