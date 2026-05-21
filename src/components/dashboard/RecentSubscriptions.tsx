import { Typography } from "@wanteddev/wds";
import type { SubscriptionDetail } from "../../type/subscribe";
import { CATEGORY_META } from "../../type/subscribe";
import {
  formatKRW,
  getDDayLabel,
  getDaysUntil,
  getNextBillingDate,
} from "../../utils/format";

interface RecentSubscriptionsProps {
  subscriptions: SubscriptionDetail[];
}

export default function RecentSubscriptions({
  subscriptions,
}: RecentSubscriptionsProps) {
  const recent = [...subscriptions]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <div
      style={{
        borderRadius: "12px",
        backgroundColor: "var(--semantic-background-normal-normal)",
        border: "1px solid #e3e8ee",
        boxShadow: "rgba(0,55,112,0.08) 0 1px 3px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e3e8ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="label1"
          weight="bold"
          color="semantic.label.normal"
        >
          최근 등록 구독
        </Typography>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
        {recent.map((sub) => {
          const nextBillingDate = getNextBillingDate(
            sub.billingDay,
            sub.billingCycle,
            sub.billingMonth,
          );
          const days = getDaysUntil(nextBillingDate);
          const isUpcoming = days >= 0 && days <= 7;
          const isPaused = sub.status === "PAUSED";
          const meta = CATEGORY_META[sub.category];
          const initials = sub.serviceName.charAt(0).toUpperCase();

          return (
            <li
              key={sub.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 20px",
                opacity: isPaused ? 0.5 : 1,
                borderBottom: "1px solid #f0f4f8",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #0066ff22, #0066ff33)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: "#0066FF",
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "2px",
                  }}
                >
                  <Typography
                    variant="body2"
                    weight="medium"
                    color="semantic.label.normal"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {sub.serviceName}
                  </Typography>
                  {isPaused && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "600",
                        color: "#64748d",
                        backgroundColor: "#f1f5f9",
                        padding: "1px 6px",
                        borderRadius: "9999px",
                        flexShrink: 0,
                      }}
                    >
                      일시정지
                    </span>
                  )}
                </div>
                <Typography
                  variant="caption1"
                  color="semantic.label.alternative"
                >
                  {meta.emoji} {meta.label}
                </Typography>
              </div>

              {/* Billing info */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    justifyContent: "flex-end",
                    marginBottom: "2px",
                  }}
                >
                  {isUpcoming && (
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: "700",
                        color: "#0066FF",
                        backgroundColor: "rgba(0,102,255,0.08)",
                        padding: "1px 5px",
                        borderRadius: "9999px",
                      }}
                    >
                      {getDDayLabel(nextBillingDate)}
                    </span>
                  )}
                  <Typography
                    variant="caption1"
                    color="semantic.label.alternative"
                  >
                    {nextBillingDate}
                  </Typography>
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#0d253d",
                    fontFeatureSettings: '"tnum"',
                    letterSpacing: "-0.42px",
                  }}
                >
                  {formatKRW(sub.price)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
