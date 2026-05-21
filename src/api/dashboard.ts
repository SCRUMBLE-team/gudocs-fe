import type { ApiResponse } from "../type/api";
import type { Dashboard } from "../type/dashboard";
import { server_axiosInstance } from "./instance";

export async function getDashboard(): Promise<ApiResponse<Dashboard>> {
  const response = await server_axiosInstance.get("/api/dashboard");
  return response.data;
}
