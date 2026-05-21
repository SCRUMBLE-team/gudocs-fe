import { Typography, Button, FallbackView, FallbackViewText } from "@wanteddev/wds";
import AppLayout from "../../layouts/AppLayout";
import { useAnalytics } from "../../hooks/useAnalytics";
import AnalyticsSkeleton from "../../components/analytics/AnalyticsSkeleton";
import AnalyticsSummaryCards from "../../components/analytics/AnalyticsSummaryCards";
import ExpenseTrendChart from "../../components/analytics/ExpenseTrendChart";
import CategoryBreakdown from "../../components/analytics/CategoryBreakdown";
import MonthlySubscriptionList from "../../components/analytics/MonthlySubscriptionList";

const MONTH_NAMES = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월",
];

export default function AnalyticsPage() {
  const {
    summary,
    categories,
    trends,
    details,
    loading,
    error,
    year,
    month,
    isCurrentMonth,
    prevMonth,
    nextMonth,
    retry,
  } = useAnalytics();

  return (
    <AppLayout>
      <main
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 24px 56px" }}
      >
        {/* ── Page header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <Typography
              variant="title2"
              weight="bold"
              color="semantic.label.normal"
              style={{ display: "block" }}
            >
              지출 분석
            </Typography>
            <Typography
              variant="body2"
              color="semantic.label.alternative"
              style={{ display: "block", marginTop: "2px" }}
            >
              월별 구독 지출 현황을 확인하세요
            </Typography>
          </div>

          {/* ── Month selector ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "var(--semantic-background-normal-normal)",
              border: "1px solid var(--semantic-line-solid-normal)",
              borderRadius: "12px",
              padding: "4px",
            }}
          >
            <button
              onClick={prevMonth}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: "#64748b",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--semantic-background-normal-alternative)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
              aria-label="이전 달"
            >
              ‹
            </button>
            <div
              style={{
                minWidth: "108px",
                textAlign: "center",
                padding: "0 4px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "700",
                  color: "var(--semantic-label-normal)",
                  fontFamily: "Pretendard, sans-serif",
                  letterSpacing: "-0.2px",
                }}
              >
                {year}년 {MONTH_NAMES[month - 1]}
              </span>
              {isCurrentMonth && (
                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "10px",
                    fontWeight: "600",
                    color: "#0066FF",
                    backgroundColor: "rgba(0,102,255,0.08)",
                    borderRadius: "999px",
                    padding: "1px 6px",
                    fontFamily: "Pretendard, sans-serif",
                  }}
                >
                  이번 달
                </span>
              )}
            </div>
            <button
              onClick={nextMonth}
              disabled={isCurrentMonth}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                border: "none",
                cursor: isCurrentMonth ? "default" : "pointer",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                color: isCurrentMonth ? "#cbd5e1" : "#64748b",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                if (!isCurrentMonth)
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--semantic-background-normal-alternative)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "transparent";
              }}
              aria-label="다음 달"
            >
              ›
            </button>
          </div>
        </div>

        {/* ── Loading ── */}
        {loading && <AnalyticsSkeleton />}

        {/* ── Error ── */}
        {!loading && error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "80px 24px",
              gap: "16px",
            }}
          >
            <FallbackView>
              <FallbackViewText description={error} />
            </FallbackView>
            <Button
              variant="outlined"
              color="assistive"
              size="medium"
              onClick={retry}
            >
              다시 시도
            </Button>
          </div>
        )}

        {/* ── Content ── */}
        {!loading && !error && summary && categories && trends && details && (
          <>
            {/* Summary cards */}
            <AnalyticsSummaryCards summary={summary} />

            {/* Charts row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "3fr 2fr",
                gap: "16px",
              }}
            >
              <ExpenseTrendChart
                trends={trends}
                currentYear={year}
                currentMonth={month}
              />
              <CategoryBreakdown categories={categories} />
            </div>

            {/* Subscription detail table */}
            <MonthlySubscriptionList
              details={details}
              year={year}
              month={month}
            />
          </>
        )}
      </main>
    </AppLayout>
  );
}
