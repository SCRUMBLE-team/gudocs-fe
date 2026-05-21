import { useNavigate } from "react-router-dom";
import { Typography } from "@wanteddev/wds";
import type { CategorySummary as CategorySummaryItem } from "../../type/dashboard";
import { CATEGORY_META } from "../../type/subscribe";
import { formatKRW } from "../../utils/format";

interface CategorySummaryProps {
  categorySummaries: CategorySummaryItem[];
}

export default function CategorySummary({
  categorySummaries,
}: CategorySummaryProps) {
  const navigate = useNavigate();

  const rows = [...categorySummaries].sort(
    (a, b) => b.monthlyAmount - a.monthlyAmount,
  );

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
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #e3e8ee" }}>
        <Typography
          variant="label1"
          weight="bold"
          color="semantic.label.normal"
        >
          카테고리별 지출
        </Typography>
      </div>

      <ul style={{ listStyle: "none", margin: 0, padding: "8px 0" }}>
        {rows.map(({ category, monthlyAmount, ratio }) => {
          const meta = CATEGORY_META[category];
          return (
            <li
              key={category}
              style={{ padding: "10px 20px", cursor: "pointer" }}
              onClick={() => navigate(`/analytics?category=${category}`)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLLIElement).style.backgroundColor =
                  "rgba(0,102,255,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLLIElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span style={{ fontSize: "16px" }}>{meta.emoji}</span>
                  <Typography variant="body2" color="semantic.label.normal">
                    {meta.label}
                  </Typography>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
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
                    {formatKRW(monthlyAmount)}
                  </p>
                </div>
              </div>
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
                    backgroundColor: "#0066FF",
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
