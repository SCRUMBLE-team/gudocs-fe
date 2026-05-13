import { useNavigate } from "react-router-dom";
import { Typography } from "@wanteddev/wds";
import type { SubscribeCategory, SubscriptionDetail } from "../../type/subscribe";
import { CATEGORY_META } from "../../type/subscribe";
import { formatKRW } from "../../utils/format";

interface CategorySummaryProps {
  subscriptions: SubscriptionDetail[];
}

export default function CategorySummary({ subscriptions }: CategorySummaryProps) {
  const navigate = useNavigate();

  const activeSubscriptions = subscriptions.filter((s) => s.status === "ACTIVE");
  const totalAmount = activeSubscriptions.reduce((sum, s) => sum + s.price, 0);

  const byCategory = activeSubscriptions.reduce<Record<string, number>>((acc, s) => {
    acc[s.category] = (acc[s.category] ?? 0) + s.price;
    return acc;
  }, {});

  const rows = Object.entries(byCategory)
    .map(([category, amount]) => ({
      category: category as SubscribeCategory,
      amount,
      ratio: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

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
        }}
      >
        <Typography variant="label1" weight="bold" color="semantic.label.normal">
          카테고리별 지출
        </Typography>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
        {rows.map(({ category, amount, ratio }) => {
          const meta = CATEGORY_META[category];
          return (
            <li
              key={category}
              style={{ padding: "10px 20px", cursor: "pointer" }}
              onClick={() => navigate(`/analytics?category=${category}`)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLLIElement).style.backgroundColor = "rgba(83,58,253,0.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLLIElement).style.backgroundColor = "transparent"; }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "16px" }}>{meta.emoji}</span>
                  <Typography variant="body2" color="semantic.label.normal">
                    {meta.label}
                  </Typography>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748d",
                      fontWeight: "500",
                    }}
                  >
                    {ratio}%
                  </span>
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
                    {formatKRW(amount)}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div
                style={{
                  height: "4px",
                  borderRadius: "9999px",
                  backgroundColor: "#f0f4f8",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${ratio}%`,
                    borderRadius: "9999px",
                    backgroundColor: "#533afd",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
