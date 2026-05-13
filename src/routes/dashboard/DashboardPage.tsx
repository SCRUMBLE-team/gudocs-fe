import type { SubscriptionDetail } from "../../type/subscribe";
import mockData from "../../mocks/mock.json";
import Header, { type BellNotification } from "../../layouts/Header";
import PaymentAlert from "../../components/dashboard/PaymentAlert";
import SummaryCards from "../../components/dashboard/SummaryCards";
import RecentSubscriptions from "../../components/dashboard/RecentSubscriptions";
import CategorySummary from "../../components/dashboard/CategorySummary";
import SubscriptionList from "../../components/dashboard/SubscriptionList";
import { getDaysUntil, getNextBillingDate } from "../../utils/format";

const subscriptions = mockData as SubscriptionDetail[];

const notifications: BellNotification[] = subscriptions
  .filter((s) => s.status === "ACTIVE")
  .map((s) => ({
    subscriptionId: s.subscriptionId,
    serviceName: s.serviceName,
    nextBillingDate: getNextBillingDate(s.billingDay, s.billingCycle, s.billingMonth),
    price: s.price,
  }))
  .filter((n) => {
    const days = getDaysUntil(n.nextBillingDate);
    return days >= 0 && days <= 7;
  });

export default function DashboardPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f6f9fc" }}>
      <Header notifications={notifications} />

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 48px" }}>
        {/* Payment alert banner */}
        <PaymentAlert subscriptions={subscriptions} />

        {/* Summary cards */}
        <SummaryCards subscriptions={subscriptions} />

        {/* Two-column layout: RecentSubscriptions + CategorySummary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <RecentSubscriptions subscriptions={subscriptions} />
          <CategorySummary subscriptions={subscriptions} />
        </div>

        {/* Full subscription list */}
        <SubscriptionList subscriptions={subscriptions} />
      </main>
    </div>
  );
}
