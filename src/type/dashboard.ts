import type { SubscribeCategory, SubscriptionDetail } from "./subscribe";

export interface CategorySummary {
  category: SubscribeCategory;
  monthlyAmount: number;
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
  daysUntilBilling: number;
  nextBillingDate: string;
  price: number;
  serviceName: string;
  subscriptionId: number;
}

export type RecentSubscription = Pick<
  SubscriptionDetail,
  "id" | "serviceName" | "category" | "status" | "createdAt"
>;
