import { useNavigate } from "react-router-dom";
import { Typography } from "@wanteddev/wds";
import type { SubscriptionDetail } from "../../type/subscribe";
import { formatKRW } from "../../utils/format";

interface SummaryCardsProps {
  subscriptions: SubscriptionDetail[];
}

const CARD_STYLE: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: "20px 24px",
  borderRadius: "12px",
  backgroundColor: "var(--semantic-background-normal-normal)",
  border: "1px solid #e3e8ee",
  boxShadow: "rgba(0,55,112,0.08) 0 1px 3px",
  cursor: "pointer",
  transition: "box-shadow 0.15s, transform 0.15s",
};

export default function SummaryCards({ subscriptions }: SummaryCardsProps) {
  const navigate = useNavigate();

  const today = new Date();
  const currentMonth = today.getMonth() + 1;

  const activeSubscriptions = subscriptions.filter((s) => s.status === "ACTIVE");

  const monthlyTotal = activeSubscriptions
    .filter((s) => {
      if (s.billingCycle === "MONTHLY") return true;
      return s.billingMonth === currentMonth;
    })
    .reduce((sum, s) => sum + s.price, 0);

  const activeCount = activeSubscriptions.length;

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "rgba(0,55,112,0.14) 0 4px 12px";
    e.currentTarget.style.transform = "translateY(-1px)";
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.boxShadow = "rgba(0,55,112,0.08) 0 1px 3px";
    e.currentTarget.style.transform = "translateY(0)";
  };

  return (
    <div
      style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}
    >
      {/* 이번 달 총 지출 */}
      <div
        style={CARD_STYLE}
        onClick={() => navigate("/subscriptions")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Typography variant="body2" color="semantic.label.alternative" style={{ display: "block", marginBottom: "8px" }}>
          이번 달 총 지출
        </Typography>
        <p
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            color: "#0d253d",
            fontFeatureSettings: '"tnum"',
            letterSpacing: "-0.42px",
            lineHeight: 1.2,
          }}
        >
          {formatKRW(monthlyTotal)}
        </p>
        <Typography
          variant="caption1"
          color="semantic.label.alternative"
          style={{ display: "block", marginTop: "6px" }}
        >
          활성 구독 기준
        </Typography>
      </div>

      {/* 활성 구독 */}
      <div
        style={CARD_STYLE}
        onClick={() => navigate("/analytics")}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Typography variant="body2" color="semantic.label.alternative" style={{ display: "block", marginBottom: "8px" }}>
          활성 구독
        </Typography>
        <p
          style={{
            margin: 0,
            fontSize: "28px",
            fontWeight: "700",
            color: "#0d253d",
            fontFeatureSettings: '"tnum"',
            letterSpacing: "-0.42px",
            lineHeight: 1.2,
          }}
        >
          {activeCount}
          <span style={{ fontSize: "16px", fontWeight: "400", marginLeft: "4px", color: "#64748d" }}>개</span>
        </p>
        <Typography
          variant="caption1"
          color="semantic.label.alternative"
          style={{ display: "block", marginTop: "6px" }}
        >
          전체 {subscriptions.length}개 중
        </Typography>
      </div>
    </div>
  );
}
