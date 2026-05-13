import type { ApiResponse } from "../type/api";
import type {
  SubscribeCategory,
  SubscribeStatus,
  Subscription,
  SubscriptionDetail,
} from "../type/subscribe";
import { server_axiosInstance } from "./instance";

export async function createSubscriptions(data: Subscription) {
  const response = await server_axiosInstance.post("/api/subscriptions", data);
  return response.data;
}

export async function getSubscriptions({
  category,
  status,
}: {
  category?: SubscribeCategory;
  status?: SubscribeStatus;
}): Promise<ApiResponse<SubscriptionDetail[]>> {
  const response = await server_axiosInstance.get("/api/subscriptions", {
    params: { category, status },
  });
  return response.data;
}

export async function getSubscriptionById(
  subscriptionId: string,
): Promise<ApiResponse<SubscriptionDetail>> {
  const response = await server_axiosInstance.get(
    `/api/subscriptions/${subscriptionId}`,
  );
  return response.data;
}

export async function editSubscription({
  subscriptionId,
  data,
}: {
  subscriptionId: string;
  data: Subscription;
}) {
  const response = await server_axiosInstance.put(
    `/api/subscriptions/${subscriptionId}`,
    data,
  );
  return response.data;
}

export async function deleteSubscription(subscriptionId: string) {
  const response = await server_axiosInstance.delete(
    `/api/subscriptions/${subscriptionId}`,
  );
  return response.data;
}

export async function changeSubscribeStatus(subscriptionId: string) {
  const response = await server_axiosInstance.put(
    `/api/subscriptions/${subscriptionId}/status`,
  );
  return response.data;
}
