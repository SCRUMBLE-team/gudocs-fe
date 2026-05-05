import axios from "axios";

export const server_axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 200000,
  withCredentials: true,
});
