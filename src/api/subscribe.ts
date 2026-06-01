import type { ApiResponse } from "../type/api";
import type { UpcomingNotification } from "../type/dashboard";
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

export async function changeSubscribeStatus({
  subscriptionId,
  status,
}: {
  subscriptionId: string;
  status: SubscribeStatus;
}) {
  const response = await server_axiosInstance.put(
    `/api/subscriptions/${subscriptionId}/status`,
    {
      status,
    },
  );
  return response.data;
}

export async function getUpcomingNotification(): Promise<
  ApiResponse<UpcomingNotification[]>
> {
  const response = await server_axiosInstance.get(
    "/api/notifications/upcoming",
  );
  return response.data;
}
