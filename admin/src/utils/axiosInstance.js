import axios from "axios";
import { setupErrorInterceptor } from "./interceptors.js";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

/**
 * Setup global error interceptor
 * This handles common errors like 401 Unauthorized, network errors, etc.
 */
const setupGlobalErrorHandling = (onAuthError) => {
  setupErrorInterceptor(axiosInstance, onAuthError);
};

export { setupGlobalErrorHandling };
export default axiosInstance;
