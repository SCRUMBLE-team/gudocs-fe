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

export async function changeName(name: string) {
  const response = await server_axiosInstance.put("/api/users/me/name", {
    name,
  });

  return response.data;
}

export async function changePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const response = await server_axiosInstance.put("/api/users/me/password", {
    currentPassword,
    newPassword,
  });

  return response.data;
}

export async function deleteUser(currentPassword: string) {
  const response = await server_axiosInstance.request({
    method: "DELETE",
    url: "/api/users/me",
    data: { currentPassword },
  });
  return response.data;
}
