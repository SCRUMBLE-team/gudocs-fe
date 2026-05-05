import type {
  LoginRequest,
  LoginResponseData,
  SignUpRequest,
  SignUpResponseData,
} from "../type/auth";
import { server_axiosInstance } from "./instance";

export async function signUp(data: SignUpRequest): Promise<SignUpResponseData> {
  const response = await server_axiosInstance.post("/api/auth/signup", data);
  return response.data;
}

export async function login(data: LoginRequest): Promise<LoginResponseData> {
  const response = await server_axiosInstance.post("/api/auth/login", data);
  return response.data;
}

export async function logout() {
  const response = await server_axiosInstance.post("/api/auth/logout");
  return response.data;
}
