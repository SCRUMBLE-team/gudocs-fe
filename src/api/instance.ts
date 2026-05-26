import axios from "axios";

export const server_axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 200000,
  withCredentials: true,
});
