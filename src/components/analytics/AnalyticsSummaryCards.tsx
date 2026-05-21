import { Typography } from "@wanteddev/wds";
import type { MonthlyExpense } from "../../type/expenses";
import { formatKRW } from "../../utils/format";

interface Props {
  summary: MonthlyExpense;
}

interface CardConfig {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
  bg: string;
}

function buildCards(summary: MonthlyExpense): CardConfig[] {
  const {
    totalAmount,
    changeRate,
    changeAmount,
    monthlySubscriptionAmount,
    annualSubscriptionMonthlyConvertedAmount,
  } = summary;

  const isUp = changeRate > 0;
  const isDown = changeRate < 0;

  return [
    {
      label: "이번 달 총 지출",
      value: formatKRW(totalAmount),
      sub: "활성 구독 합산",
      icon: "💳",
      color: "#0066FF",
      bg: "rgba(0,102,255,0.07)",
    },
    {
      label: "전월 대비",
      value:
        changeRate === 0
          ? "변동 없음"
          : `${isUp ? "+" : ""}${changeRate.toFixed(1)}%`,
      sub:
        changeAmount === 0
          ? "지난달과 동일"
          : `${isUp ? "+" : ""}${formatKRW(Math.abs(changeAmount))}`,
      icon: isUp ? "📈" : isDown ? "📉" : "➡️",
      color: isUp ? "#dc2626" : isDown ? "#16a34a" : "#64748b",
      bg: isUp
        ? "rgba(220,38,38,0.07)"
        : isDown
          ? "rgba(22,163,74,0.07)"
          : "rgba(100,116,139,0.07)",
    },
    {
      label: "월 구독 합계",
      value: formatKRW(monthlySubscriptionAmount),
      sub: "월 단위 결제 구독",
      icon: "🔄",
      color: "#7c3aed",
      bg: "rgba(124,58,237,0.07)",
    },
    {
      label: "연 구독 월 환산",
      value: formatKRW(annualSubscriptionMonthlyConvertedAmount),
      sub: "연간 결제 구독 월 환산액",
      icon: "📅",
      color: "#0891b2",
      bg: "rgba(8,145,178,0.07)",
    },
  ];
}

export default function AnalyticsSummaryCards({ summary }: Props) {
  const cards = buildCards(summary);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "16px",
        marginBottom: "24px",
      }}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            backgroundColor: "var(--semantic-background-normal-normal)",
            borderRadius: "16px",
            padding: "20px 22px",
            border: "1px solid var(--semantic-line-solid-normal)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <Typography variant="caption1" color="semantic.label.alternative">
              {card.label}
            </Typography>
            <span
              style={{
                fontSize: "18px",
                backgroundColor: card.bg,
                borderRadius: "8px",
                padding: "4px 6px",
                lineHeight: 1,
              }}
            >
              {card.icon}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: "800",
              color: card.color,
              fontFamily: "Pretendard, sans-serif",
              letterSpacing: "-0.5px",
            }}
          >
            {card.value}
          </p>
          <Typography variant="caption1" color="semantic.label.alternative">
            {card.sub}
          </Typography>
        </div>
      ))}
    </div>
  );
}
