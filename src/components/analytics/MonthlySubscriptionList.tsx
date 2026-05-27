import { useNavigate } from "react-router-dom";
import { Typography } from "@wanteddev/wds";
import type { MonthlyDetailData } from "../../type/expenses";
import { CATEGORY_META } from "../../type/subscribe";
import { formatKRW } from "../../utils/format";

interface Props {
  details: MonthlyDetailData;
  year: number;
  month: number;
}

const BILLING_CYCLE_LABEL: Record<string, string> = {
  MONTHLY: "월간 결제",
  YEARLY: "연간 결제",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE:  { label: "활성",     color: "#16a34a", bg: "rgba(34,197,94,0.1)"    },
  PAUSED:  { label: "일시 정지", color: "#94a3b8", bg: "rgba(148,163,184,0.12)" },
  DELETED: { label: "삭제됨",   color: "#ef4444", bg: "rgba(239,68,68,0.1)"    },
};

export default function MonthlySubscriptionList({ details, year, month }: Props) {
  const navigate = useNavigate();
  const { totalAmount, subscriptions } = details;

  return (
    <div
      style={{
        backgroundColor: "var(--semantic-background-normal-normal)",
        borderRadius: "16px",
        padding: "22px 24px",
        border: "1px solid var(--semantic-line-solid-normal)",
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <Typography
            variant="title3"
            weight="bold"
            color="semantic.label.normal"
            style={{ display: "block" }}
          >
            {year}년 {month}월 구독 목록
          </Typography>
          <Typography
            variant="caption1"
            color="semantic.label.alternative"
            style={{ display: "block", marginTop: "2px" }}
          >
            {subscriptions.length}개 구독 · 합계{" "}
            <strong style={{ color: "#0066FF" }}>{formatKRW(totalAmount)}</strong>
          </Typography>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            borderRadius: "12px",
            backgroundColor: "var(--semantic-background-normal-alternative)",
          }}
        >
          <span style={{ fontSize: "32px" }}>📭</span>
          <Typography
            variant="body2"
            color="semantic.label.alternative"
            style={{ display: "block", marginTop: "10px" }}
          >
            이번 달 구독 내역이 없습니다
          </Typography>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px",
              fontFamily: "Pretendard, sans-serif",
            }}
          >
            <thead>
              <tr>
                {["서비스", "카테고리", "결제 주기", "상태", "원가", "적용 월액"].map(
                  (col) => (
                    <th
                      key={col}
                      style={{
                        textAlign:
                          col === "원가" || col === "적용 월액" ? "right" : "left",
                        padding: "8px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#94a3b8",
                        borderBottom:
                          "1px solid var(--semantic-line-solid-normal)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => {
                const catMeta = CATEGORY_META[sub.category];
                const cycleLabel =
                  BILLING_CYCLE_LABEL[sub.billingCycle] ?? sub.billingCycle;
                const isDeleted = sub.deleted;
                const isPaused = sub.status === "PAUSED";
                const statusKey = isDeleted ? "DELETED" : sub.status;
                const statusCfg = STATUS_CONFIG[statusKey] ?? {
                  label: sub.status,
                  color: "#64748b",
                  bg: "rgba(100,116,139,0.1)",
                };
                return (
                  <tr
                    key={sub.subscriptionId}
                    onClick={() => navigate(`/subscriptions/${sub.subscriptionId}`)}
                    style={{
                      cursor: "pointer",
                      opacity: isDeleted || isPaused ? 0.6 : 1,
                      transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        "var(--semantic-background-normal-alternative)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid var(--semantic-line-solid-normal)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            background:
                              "linear-gradient(135deg, #0066FF, #4D94FF)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "13px",
                            fontWeight: "700",
                            flexShrink: 0,
                          }}
                        >
                          {sub.serviceName.charAt(0).toUpperCase()}
                        </div>
                        <Typography
                          variant="body2"
                          weight="bold"
                          color="semantic.label.normal"
                        >
                          {sub.serviceName}
                        </Typography>
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid var(--semantic-line-solid-normal)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "12px",
                          color: "#64748b",
                        }}
                      >
                        {catMeta?.emoji}{" "}
                        {sub.categoryName || catMeta?.label || sub.category}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid var(--semantic-line-solid-normal)",
                      }}
                    >
                      <Typography variant="caption1" color="semantic.label.alternative">
                        {cycleLabel}
                      </Typography>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid var(--semantic-line-solid-normal)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "11px",
                          fontWeight: "600",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          backgroundColor: statusCfg.bg,
                          color: statusCfg.color,
                          fontFamily: "Pretendard, sans-serif",
                        }}
                      >
                        {statusCfg.label}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid var(--semantic-line-solid-normal)",
                        textAlign: "right",
                      }}
                    >
                      <Typography variant="caption1" color="semantic.label.alternative">
                        {formatKRW(sub.originalPrice)}
                      </Typography>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid var(--semantic-line-solid-normal)",
                        textAlign: "right",
                      }}
                    >
                      <Typography
                        variant="body2"
                        weight="bold"
                        style={{ color: "#0066FF" }}
                      >
                        {formatKRW(sub.appliedMonthlyAmount)}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td
                  colSpan={5}
                  style={{ padding: "14px 12px", textAlign: "right" }}
                >
                  <Typography
                    variant="label1"
                    weight="bold"
                    color="semantic.label.alternative"
                  >
                    합계
                  </Typography>
                </td>
                <td style={{ padding: "14px 12px", textAlign: "right" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: "800",
                      color: "#0066FF",
                      fontFamily: "Pretendard, sans-serif",
                    }}
                  >
                    {formatKRW(totalAmount)}
                  </p>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
