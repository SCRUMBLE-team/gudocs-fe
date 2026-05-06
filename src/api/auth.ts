import type { ApiResponse } from "../type/api";
import type {
  LoginRequest,
  SignUpRequest,
  SignUpResponseData,
  User,
} from "../type/auth";
import { server_axiosInstance } from "./instance";

export async function signUp(
  data: SignUpRequest,
): Promise<ApiResponse<SignUpResponseData>> {
  const response = await server_axiosInstance.post("/api/auth/signup", data);
  return response.data;
}

export async function login(data: LoginRequest) {
  const response = await server_axiosInstance.post("/api/auth/login", data);
  return response.data;
}

export async function logout() {
  const response = await server_axiosInstance.post("/api/auth/logout");
  return response.data;
}

export async function getUser(): Promise<ApiResponse<User>> {
  const response = await server_axiosInstance.get("/api/auth/me");
  return response.data;
}
