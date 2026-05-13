import type { SubscribeCategory, SubscriptionDetail } from "./subscribe";

export interface CategorySummary {
  category: SubscribeCategory;
  amount: number;
  ratio: number;
}

export interface Dashboard {
  upcomingNotifications: UpcomingNotification[];
  monthlyTotalExpense: number;
  activeSubscriptionCount: number;
  recentSubscriptions: RecentSubscription[];
  categorySummaries: CategorySummary[];
}

export interface UpcomingNotification {
  subscriptionId: number;
  serviceName: string;
  paymentDate: string;
  daysLeft: number;
  message: string;
}

export type RecentSubscription = Pick<
  SubscriptionDetail,
  "subscriptionId" | "serviceName" | "category" | "status" | "createdAt"
>;
