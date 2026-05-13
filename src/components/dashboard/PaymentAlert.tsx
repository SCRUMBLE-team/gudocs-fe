import type { SubscriptionDetail } from "../../type/subscribe";
import { formatKRW, getDDayLabel, getDaysUntil, getNextBillingDate } from "../../utils/format";

interface PaymentAlertProps {
  subscriptions: SubscriptionDetail[];
}

export default function PaymentAlert({ subscriptions }: PaymentAlertProps) {
  const upcoming = subscriptions
    .filter((s) => s.status === "ACTIVE")
    .map((s) => ({ ...s, nextBillingDate: getNextBillingDate(s.billingDay, s.billingCycle, s.billingMonth) }))
    .filter((s) => {
      const days = getDaysUntil(s.nextBillingDate);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => getDaysUntil(a.nextBillingDate) - getDaysUntil(b.nextBillingDate));

  if (upcoming.length === 0) return null;

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "14px 16px",
        borderRadius: "12px",
        backgroundColor: "#fffbeb",
        border: "1px solid #fde68a",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#92400e",
          }}
        >
          7일 이내 결제 예정 {upcoming.length}건
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {upcoming.map((s) => {
            const days = getDaysUntil(s.nextBillingDate);
            return (
              <div
                key={s.subscriptionId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  backgroundColor: days <= 1 ? "#fef3c7" : "#fff",
                  border: `1px solid ${days <= 1 ? "#f59e0b" : "#fde68a"}`,
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    color: days <= 1 ? "#b45309" : "#d97706",
                  }}
                >
                  {getDDayLabel(s.nextBillingDate)}
                </span>
                <span style={{ fontSize: "13px", color: "#0d253d", fontWeight: "500" }}>
                  {s.serviceName}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748d",
                    fontFeatureSettings: '"tnum"',
                    letterSpacing: "-0.42px",
                  }}
                >
                  {formatKRW(s.price)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
