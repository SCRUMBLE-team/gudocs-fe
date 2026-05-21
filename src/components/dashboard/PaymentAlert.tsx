import type { UpcomingNotification } from "../../type/dashboard";

interface PaymentAlertProps {
  notifications: UpcomingNotification[];
}

export default function PaymentAlert({ notifications }: PaymentAlertProps) {
  if (notifications.length === 0) return null;

  const getDDayLabel = (daysLeft: number) =>
    daysLeft === 0 ? "D-Day" : `D-${daysLeft}`;

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
      <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "1px" }}>
        ⚠️
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "13px",
            fontWeight: "600",
            color: "#92400e",
          }}
        >
          7일 이내 결제 예정 {notifications.length}건
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {notifications.map((n) => (
            <div
              key={n.subscriptionId}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "9999px",
                backgroundColor: n.daysUntilBilling <= 1 ? "#fef3c7" : "#fff",
                border: `1px solid ${n.daysUntilBilling <= 1 ? "#f59e0b" : "#fde68a"}`,
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  color: n.daysUntilBilling <= 1 ? "#b45309" : "#d97706",
                }}
              >
                {getDDayLabel(n.daysUntilBilling)}
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#0d253d",
                  fontWeight: "500",
                }}
              >
                {n.serviceName}
              </span>
              <span style={{ fontSize: "12px", color: "#64748d" }}>
                {n.nextBillingDate}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
