import { useState } from "react";
import { Typography } from "@wanteddev/wds";
import type { SubscribeCategory, SubscribeStatus, SubscriptionDetail } from "../../type/subscribe";
import { CATEGORY_META, BILLING_CYCLE_META } from "../../type/subscribe";
import { formatKRW, getDDayLabel, getDaysUntil, getNextBillingDate } from "../../utils/format";

interface SubscriptionListProps {
  subscriptions: SubscriptionDetail[];
}

type SortKey = "billingDate" | "amount" | "recent";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "billingDate", label: "다음 결제일 빠른 순" },
  { value: "amount", label: "금액 높은 순" },
  { value: "recent", label: "최근 등록 순" },
];

const ALL_CATEGORIES: (SubscribeCategory | "ALL")[] = [
  "ALL",
  "OTT",
  "MUSIC",
  "CLOUD",
  "PRODUCTIVITY",
  "AI",
  "NEWS",
  "EDUCATION",
  "GAME",
  "SHOPPING",
  "DESIGN",
  "ETC",
];

function StatusToggle({
  active,
  onChange,
}: {
  active: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!active)}
      title={active ? "클릭하여 일시정지" : "클릭하여 활성화"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "2px 0",
      }}
    >
      {/* Track */}
      <span
        style={{
          position: "relative",
          display: "inline-block",
          width: "36px",
          height: "20px",
          borderRadius: "9999px",
          backgroundColor: active ? "#533afd" : "#cbd5e1",
          transition: "background-color 0.2s ease",
          flexShrink: 0,
        }}
      >
        {/* Thumb */}
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: active ? "18px" : "2px",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            transition: "left 0.2s ease",
          }}
        />
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: "600",
          color: active ? "#533afd" : "#94a3b8",
          fontFamily: "Pretendard, sans-serif",
          minWidth: "40px",
        }}
      >
        {active ? "활성" : "정지"}
      </span>
    </button>
  );
}

export default function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  const [statusFilter, setStatusFilter] = useState<SubscribeStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<SubscribeCategory | "ALL">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("billingDate");

  // local status overrides: subscriptionId → SubscribeStatus
  const [localStatuses, setLocalStatuses] = useState<Record<number, SubscribeStatus>>(() =>
    Object.fromEntries(subscriptions.map((s) => [s.subscriptionId, s.status])),
  );

  const toggleStatus = (id: number) => {
    setLocalStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === "ACTIVE" ? "PAUSED" : "ACTIVE",
    }));
  };

  const withBillingDate = subscriptions.map((s) => ({
    ...s,
    status: localStatuses[s.subscriptionId] ?? s.status,
    nextBillingDate: getNextBillingDate(s.billingDay, s.billingCycle, s.billingMonth),
  }));

  const filtered = withBillingDate
    .filter((s) => statusFilter === "ALL" || s.status === statusFilter)
    .filter((s) => categoryFilter === "ALL" || s.category === categoryFilter)
    .sort((a, b) => {
      if (sortKey === "billingDate") return getDaysUntil(a.nextBillingDate) - getDaysUntil(b.nextBillingDate);
      if (sortKey === "amount") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "5px 12px",
    borderRadius: "9999px",
    fontSize: "13px",
    fontWeight: active ? "600" : "400",
    color: active ? "#533afd" : "#64748d",
    backgroundColor: active ? "rgba(83,58,253,0.08)" : "transparent",
    border: `1px solid ${active ? "#533afd" : "#e3e8ee"}`,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "Pretendard, sans-serif",
    whiteSpace: "nowrap" as const,
  });

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
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid #e3e8ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <Typography variant="label1" weight="bold" color="semantic.label.normal">
          전체 구독 ({filtered.length}개)
        </Typography>

        {/* Sort */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          style={{
            padding: "5px 10px",
            borderRadius: "8px",
            border: "1px solid #e3e8ee",
            fontSize: "13px",
            color: "#0d253d",
            backgroundColor: "white",
            cursor: "pointer",
            fontFamily: "Pretendard, sans-serif",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #e3e8ee",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {/* Status filter */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {(["ALL", "ACTIVE", "PAUSED"] as const).map((s) => (
            <button
              key={s}
              style={chipStyle(statusFilter === s)}
              onClick={() => setStatusFilter(s)}
            >
              {s === "ALL" ? "전체" : s === "ACTIVE" ? "활성" : "일시정지"}
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c}
              style={chipStyle(categoryFilter === c)}
              onClick={() => setCategoryFilter(c as SubscribeCategory | "ALL")}
            >
              {c === "ALL"
                ? "전체 카테고리"
                : `${CATEGORY_META[c as SubscribeCategory].emoji} ${CATEGORY_META[c as SubscribeCategory].label}`}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Typography variant="body2" color="semantic.label.alternative">
            해당하는 구독이 없습니다
          </Typography>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f6f9fc" }}>
                  {["서비스", "카테고리", "결제 주기", "다음 결제일", "금액", "상태"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 20px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#64748d",
                        letterSpacing: "0.02em",
                        borderBottom: "1px solid #e3e8ee",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => {
                  const isPaused = sub.status === "PAUSED";
                  const days = getDaysUntil(sub.nextBillingDate);
                  const isUpcoming = days >= 0 && days <= 7;
                  const meta = CATEGORY_META[sub.category];
                  const initials = sub.serviceName.charAt(0).toUpperCase();

                  return (
                    <tr
                      key={sub.subscriptionId}
                      style={{ opacity: isPaused ? 0.6 : 1, transition: "opacity 0.2s" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "rgba(83,58,253,0.04)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      {/* Service */}
                      <td style={{ padding: "12px 20px", borderBottom: "1px solid #f0f4f8" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, #533afd22, #7c5cff33)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              fontWeight: "700",
                              color: "#533afd",
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <Typography variant="body2" weight="medium" color="semantic.label.normal">
                            {sub.serviceName}
                          </Typography>
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "12px 20px", borderBottom: "1px solid #f0f4f8" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 8px",
                            borderRadius: "9999px",
                            backgroundColor: "#f1f5f9",
                            fontSize: "12px",
                            color: "#64748d",
                            fontWeight: "500",
                          }}
                        >
                          {meta.emoji} {meta.label}
                        </span>
                      </td>

                      {/* Billing cycle */}
                      <td style={{ padding: "12px 20px", borderBottom: "1px solid #f0f4f8" }}>
                        <Typography variant="body2" color="semantic.label.alternative">
                          {BILLING_CYCLE_META[sub.billingCycle].label === "월간 결제" ? "매월" : "매년"}
                        </Typography>
                      </td>

                      {/* Next billing date */}
                      <td style={{ padding: "12px 20px", borderBottom: "1px solid #f0f4f8" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          {isUpcoming && (
                            <span
                              style={{
                                fontSize: "10px",
                                fontWeight: "700",
                                color: "#533afd",
                                backgroundColor: "rgba(83,58,253,0.08)",
                                padding: "1px 5px",
                                borderRadius: "9999px",
                              }}
                            >
                              {getDDayLabel(sub.nextBillingDate)}
                            </span>
                          )}
                          <Typography variant="body2" color="semantic.label.alternative">
                            {sub.nextBillingDate}
                          </Typography>
                        </div>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: "12px 20px", borderBottom: "1px solid #f0f4f8" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#0d253d",
                            fontFeatureSettings: '"tnum"',
                            letterSpacing: "-0.42px",
                          }}
                        >
                          {formatKRW(sub.price)}
                        </p>
                      </td>

                      {/* Status toggle */}
                      <td style={{ padding: "12px 20px", borderBottom: "1px solid #f0f4f8" }}>
                        <StatusToggle
                          active={sub.status === "ACTIVE"}
                          onChange={() => toggleStatus(sub.subscriptionId)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile card list */}
          <div className="block md:hidden">
            <ul style={{ listStyle: "none", margin: 0, padding: "4px 0" }}>
              {filtered.map((sub) => {
                const isPaused = sub.status === "PAUSED";
                const days = getDaysUntil(sub.nextBillingDate);
                const isUpcoming = days >= 0 && days <= 7;
                const meta = CATEGORY_META[sub.category];
                const initials = sub.serviceName.charAt(0).toUpperCase();

                return (
                  <li
                    key={sub.subscriptionId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 20px",
                      opacity: isPaused ? 0.6 : 1,
                      borderBottom: "1px solid #f0f4f8",
                      transition: "opacity 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background: "linear-gradient(135deg, #533afd22, #7c5cff33)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "#533afd",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        weight="medium"
                        color="semantic.label.normal"
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        {sub.serviceName}
                      </Typography>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Typography variant="caption1" color="semantic.label.alternative">
                          {meta.emoji} {meta.label}
                        </Typography>
                        <span style={{ color: "#e3e8ee", fontSize: "10px" }}>|</span>
                        <Typography variant="caption1" color="semantic.label.alternative">
                          {BILLING_CYCLE_META[sub.billingCycle].label === "월간 결제" ? "매월" : "매년"}
                        </Typography>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flexShrink: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        {isUpcoming && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              color: "#533afd",
                              backgroundColor: "rgba(83,58,253,0.08)",
                              padding: "1px 4px",
                              borderRadius: "9999px",
                            }}
                          >
                            {getDDayLabel(sub.nextBillingDate)}
                          </span>
                        )}
                        <p
                          style={{
                            margin: 0,
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#0d253d",
                            fontFeatureSettings: '"tnum"',
                            letterSpacing: "-0.42px",
                          }}
                        >
                          {formatKRW(sub.price)}
                        </p>
                      </div>
                      <StatusToggle
                        active={sub.status === "ACTIVE"}
                        onChange={() => toggleStatus(sub.subscriptionId)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
