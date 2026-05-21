import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Typography } from "@wanteddev/wds";
import type { TrendData } from "../../type/expenses";
import { formatKRW } from "../../utils/format";

interface Props {
  trends: TrendData;
  currentYear: number;
  currentMonth: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value?: number }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        backgroundColor: "var(--semantic-background-normal-normal)",
        border: "1px solid var(--semantic-line-solid-normal)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <p
        style={{
          margin: "0 0 4px",
          fontSize: "12px",
          color: "#94a3b8",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          fontWeight: "700",
          color: "#0066FF",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        {formatKRW(payload[0].value ?? 0)}
      </p>
    </div>
  );
}

export default function ExpenseTrendChart({
  trends,
  currentYear,
  currentMonth,
}: Props) {
  const data = trends.monthlyTrends.map((t) => ({
    label: `${t.month}월`,
    year: t.year,
    month: t.month,
    totalAmount: t.totalAmount,
  }));

  const maxAmount = Math.max(...data.map((d) => d.totalAmount), 1);

  const yTickFormatter = (value: number) => {
    if (value === 0) return "0";
    if (value >= 10000) return `${(value / 10000).toFixed(0)}만`;
    return value.toLocaleString();
  };

  return (
    <div
      style={{
        backgroundColor: "var(--semantic-background-normal-normal)",
        borderRadius: "16px",
        padding: "22px 24px",
        border: "1px solid var(--semantic-line-solid-normal)",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Typography
          variant="title3"
          weight="bold"
          color="semantic.label.normal"
          style={{ display: "block" }}
        >
          월별 지출 추이
        </Typography>
        <Typography
          variant="caption1"
          color="semantic.label.alternative"
          style={{ display: "block", marginTop: "2px" }}
        >
          최근 {data.length}개월 구독 지출 현황
        </Typography>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{
              fontSize: 12,
              fill: "#94a3b8",
              fontFamily: "Pretendard, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={yTickFormatter}
            tick={{
              fontSize: 11,
              fill: "#94a3b8",
              fontFamily: "Pretendard, sans-serif",
            }}
            axisLine={false}
            tickLine={false}
            width={48}
            domain={[0, Math.ceil(maxAmount * 1.15)]}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: "rgba(0,102,255,0.04)" }}
          />
          <Bar dataKey="totalAmount" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry) => {
              const isCurrent =
                entry.year === currentYear && entry.month === currentMonth;
              return (
                <Cell
                  key={`${entry.year}-${entry.month}`}
                  fill={isCurrent ? "#0066FF" : "#bfdbfe"}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginTop: "12px",
          justifyContent: "flex-end",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "3px",
              backgroundColor: "#0066FF",
            }}
          />
          <Typography variant="caption1" color="semantic.label.alternative">
            선택 월
          </Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "3px",
              backgroundColor: "#bfdbfe",
            }}
          />
          <Typography variant="caption1" color="semantic.label.alternative">
            기타 월
          </Typography>
        </div>
      </div>
    </div>
  );
}
