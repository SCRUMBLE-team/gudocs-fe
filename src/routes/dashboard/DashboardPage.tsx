import { useState, useEffect } from "react";
import { Button, Typography, Skeleton } from "@wanteddev/wds";
import type { Dashboard } from "../../type/dashboard";
import type { SubscriptionDetail } from "../../type/subscribe";
import { getDashboard } from "../../api/dashboard";
import { getSubscriptions } from "../../api/subscribe";
import { useAuthStore } from "../../stores/useAuthStore";
import AppLayout from "../../layouts/AppLayout";
import PaymentAlert from "../../components/dashboard/PaymentAlert";
import LoginRequiredView from "../../components/dashboard/LoginRequiredView";
import NetworkErrorView from "../../components/dashboard/NetworkErrorView";

import SummaryCards from "../../components/dashboard/SummaryCards";
import RecentSubscriptions from "../../components/dashboard/RecentSubscriptions";
import CategorySummary from "../../components/dashboard/CategorySummary";
import SubscriptionList from "../../components/dashboard/SubscriptionList";
import SubscriptionFormModal from "../../components/dashboard/SubscriptionFormModal";

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [dashboardRes, subsRes] = await Promise.all([
          getDashboard(),
          getSubscriptions({}),
        ]);
        if (cancelled) return;
        setDashboard(dashboardRes.data);
        setSubscriptions(subsRes.data);
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  if (authLoading) {
    return (
      <AppLayout notifications={[]}>
        <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 48px" }}>
          <DashboardSkeleton />
        </main>
      </AppLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <AppLayout notifications={[]}>
        <LoginRequiredView />
      </AppLayout>
    );
  }

  if (!loading && error) {
    return (
      <AppLayout notifications={[]}>
        <NetworkErrorView onRetry={() => setRetryCount((c) => c + 1)} />
      </AppLayout>
    );
  }

  return (
    <AppLayout notifications={dashboard?.upcomingNotifications ?? []}>
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 24px 48px",
        }}
      >
        {/* Page header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <Typography
              variant="title2"
              weight="bold"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              대시보드
            </Typography>
            <Typography
              variant="body2"
              color="semantic.label.alternative"
              style={{ display: "block", marginTop: "2px" }}
            >
              {new Date().toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
              })}{" "}
              기준
            </Typography>
          </div>
          <Button
            variant="solid"
            color="primary"
            size="medium"
            onClick={() => setShowAddModal(true)}
          >
            + 구독 추가
          </Button>
        </div>

        {loading && <DashboardSkeleton />}

        {!loading && !error && dashboard && (
          <>
            <PaymentAlert notifications={dashboard.upcomingNotifications} />
            <SummaryCards
              monthlyTotalExpense={dashboard.monthlyTotalExpense}
              activeSubscriptionCount={dashboard.activeSubscriptionCount}
              totalCount={subscriptions.length}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
              <div className="md:col-span-3">
                <CategorySummary categorySummaries={dashboard.categorySummaries} />
              </div>
              <div className="md:col-span-2">
                <RecentSubscriptions subscriptions={subscriptions} />
              </div>
            </div>

            <SubscriptionList subscriptions={subscriptions} />
          </>
        )}
      </main>

      <SubscriptionFormModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => setRetryCount((c) => c + 1)}
      />
    </AppLayout>
  );
}

function DashboardSkeleton() {
  return (
    <>
      {/* SummaryCards skeleton */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
        <Skeleton variant="rectangle" width="100%" height={120} radius="12px" />
        <Skeleton variant="rectangle" width="100%" height={120} radius="12px" />
      </div>

      {/* 2-column skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
        <div className="md:col-span-3">
          <Skeleton variant="rectangle" width="100%" height={320} radius="12px" />
        </div>
        <div className="md:col-span-2">
          <Skeleton variant="rectangle" width="100%" height={320} radius="12px" />
        </div>
      </div>

      {/* List skeleton */}
      <Skeleton variant="rectangle" width="100%" height={400} radius="12px" />
    </>
  );
}
