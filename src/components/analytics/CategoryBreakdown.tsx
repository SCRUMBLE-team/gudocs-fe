import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Typography } from "@wanteddev/wds";
import type { CategoryExpenseData } from "../../type/expenses";
import { CATEGORY_META } from "../../type/subscribe";
import { formatKRW } from "../../utils/format";

interface Props {
  categories: CategoryExpenseData;
}

const PALETTE = [
  "#0066FF",
  "#7c3aed",
  "#0891b2",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#ea580c",
  "#db2777",
  "#65a30d",
  "#8b5cf6",
  "#94a3b8",
];

interface PieTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number;
    payload?: { color: string };
  }>;
}

function PieTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
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
          margin: "0 0 2px",
          fontSize: "12px",
          color: "#94a3b8",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        {item.name}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: "14px",
          fontWeight: "700",
          color: item.payload?.color ?? "#0066FF",
          fontFamily: "Pretendard, sans-serif",
        }}
      >
        {formatKRW(item.value ?? 0)}
      </p>
    </div>
  );
}

export default function CategoryBreakdown({ categories }: Props) {
  const sorted = [...categories.categories].sort((a, b) => b.amount - a.amount);

  const pieData = sorted.map((item, i) => ({
    name: item.categoryName || CATEGORY_META[item.category]?.label || item.category,
    value: item.amount,
    color: PALETTE[i % PALETTE.length],
    ratio: item.ratio,
    category: item.category,
  }));

  return (
    <div
      style={{
        backgroundColor: "var(--semantic-background-normal-normal)",
        borderRadius: "16px",
        padding: "22px 24px",
        border: "1px solid var(--semantic-line-solid-normal)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: "4px" }}>
        <Typography
          variant="title3"
          weight="bold"
          color="semantic.label.normal"
          style={{ display: "block" }}
        >
          카테고리별 지출
        </Typography>
        <Typography
          variant="caption1"
          color="semantic.label.alternative"
          style={{ display: "block", marginTop: "2px" }}
        >
          {sorted.length}개 카테고리
        </Typography>
      </div>

      {sorted.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0",
          }}
        >
          <Typography variant="body2" color="semantic.label.alternative">
            이번 달 지출 내역이 없습니다
          </Typography>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry) => (
                  <Cell key={entry.category} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            {sorted.map((item, i) => {
              const meta = CATEGORY_META[item.category];
              const color = PALETTE[i % PALETTE.length];
              const label =
                item.categoryName || meta?.label || item.category;
              return (
                <div key={item.category}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>{meta?.emoji}</span>
                      <Typography variant="caption1" color="semantic.label.normal">
                        {label}
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <Typography
                        variant="caption1"
                        color="semantic.label.alternative"
                      >
                        {item.ratio.toFixed(1)}%
                      </Typography>
                      <Typography
                        variant="caption1"
                        weight="bold"
                        style={{ color }}
                      >
                        {formatKRW(item.amount)}
                      </Typography>
                    </div>
                  </div>
                  <div
                    style={{
                      height: "4px",
                      borderRadius: "999px",
                      backgroundColor: "var(--semantic-line-solid-normal)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(item.ratio, 100)}%`,
                        backgroundColor: color,
                        borderRadius: "999px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
