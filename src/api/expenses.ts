import type { ApiResponse } from "../type/api";
import type {
  MonthlyExpense,
  CategoryExpenseData,
  TrendData,
  MonthlyDetailData,
} from "../type/expenses";
import { server_axiosInstance } from "./instance";

export async function getMonthlyExpense({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<ApiResponse<MonthlyExpense>> {
  const response = await server_axiosInstance.get(
    "/api/subscriptions/expenses/monthly",
    { params: { year, month } },
  );
  return response.data;
}

export async function getCategoryExpenses({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<ApiResponse<CategoryExpenseData>> {
  const response = await server_axiosInstance.get(
    "/api/subscriptions/expenses/categories",
    { params: { year, month } },
  );
  return response.data;
}

export async function getExpenseTrends({
  baseYear,
  baseMonth,
}: {
  baseYear: number;
  baseMonth: number;
}): Promise<ApiResponse<TrendData>> {
  const response = await server_axiosInstance.get(
    "/api/subscriptions/expenses/trends",
    { params: { baseYear, baseMonth } },
  );
  return response.data;
}

export async function getMonthlyExpenseDetails({
  year,
  month,
}: {
  year: number;
  month: number;
}): Promise<ApiResponse<MonthlyDetailData>> {
  const response = await server_axiosInstance.get(
    "/api/subscriptions/expenses/monthly/details",
    { params: { year, month } },
  );
  return response.data;
}
