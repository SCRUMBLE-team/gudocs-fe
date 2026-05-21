import { useState } from "react";
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "@wanteddev/wds";
import type {
  SubscribeCategory,
  SubscribeStatus,
  SubscriptionDetail,
} from "../../type/subscribe";
import { CATEGORY_META, BILLING_CYCLE_META } from "../../type/subscribe";
import {
  formatKRW,
  getDDayLabel,
  getDaysUntil,
  getNextBillingDate,
} from "../../utils/format";
import { useNavigate } from "react-router-dom";
import { changeSubscribeStatus } from "../../api/subscribe";

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
  disabled,
  onChange,
}: {
  active: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange();
      }}
      title={active ? "클릭하여 일시정지" : "클릭하여 활성화"}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        background: "none",
        border: "none",
        cursor: disabled ? "wait" : "pointer",
        padding: "2px 0",
        opacity: disabled ? 0.6 : 1,
        transition: "opacity 0.15s",
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
          backgroundColor: active ? "#0066FF" : "#cbd5e1",
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
          color: active ? "#0066FF" : "#94a3b8",
          fontFamily: "Pretendard, sans-serif",
          minWidth: "40px",
        }}
      >
        {active ? "활성" : "정지"}
      </span>
    </button>
  );
}

export default function SubscriptionList({
  subscriptions,
}: SubscriptionListProps) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<SubscribeStatus | "ALL">(
    "ALL",
  );
  const [categoryFilter, setCategoryFilter] = useState<
    SubscribeCategory | "ALL"
  >("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("billingDate");

  // local status overrides: id → SubscribeStatus
  const [localStatuses, setLocalStatuses] = useState<
    Record<number, SubscribeStatus>
  >(() => Object.fromEntries(subscriptions.map((s) => [s.id, s.status])));

  // 요청 중인 id 집합 (중복 클릭 방지)
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());

  const toggleStatus = async (id: number) => {
    if (pendingIds.has(id)) return;

    const prevStatus = localStatuses[id];
    const nextStatus: SubscribeStatus = prevStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";

    // 낙관적 업데이트
    setLocalStatuses((prev) => ({ ...prev, [id]: nextStatus }));
    setPendingIds((prev) => new Set(prev).add(id));

    try {
      await changeSubscribeStatus({ subscriptionId: String(id), status: nextStatus });
    } catch (err) {
      console.error(err);
      // 실패 시 원래 상태로 복구
      setLocalStatuses((prev) => ({ ...prev, [id]: prevStatus }));
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const withBillingDate = subscriptions.map((s) => ({
    ...s,
    status: localStatuses[s.id] ?? s.status,
    nextBillingDate: getNextBillingDate(
      s.billingDay,
      s.billingCycle,
      s.billingMonth,
    ),
  }));

  const filtered = withBillingDate
    .filter((s) => statusFilter === "ALL" || s.status === statusFilter)
    .filter((s) => categoryFilter === "ALL" || s.category === categoryFilter)
    .sort((a, b) => {
      if (sortKey === "billingDate")
        return (
          getDaysUntil(a.nextBillingDate) - getDaysUntil(b.nextBillingDate)
        );
      if (sortKey === "amount") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: "5px 12px",
    borderRadius: "9999px",
    fontSize: "13px",
    fontWeight: active ? "600" : "400",
    color: active ? "#0066FF" : "#64748d",
    backgroundColor: active ? "rgba(0,102,255,0.08)" : "transparent",
    border: `1px solid ${active ? "#0066FF" : "#e3e8ee"}`,
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
        <Typography
          variant="label1"
          weight="bold"
          color="semantic.label.normal"
        >
          전체 구독 ({filtered.length}개)
        </Typography>

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

      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid #e3e8ee",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
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

      {filtered.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center" }}>
          <Typography variant="body2" color="semantic.label.alternative">
            해당하는 구독이 없습니다
          </Typography>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHead>
                <TableRow>
                  {["서비스", "카테고리", "결제 주기", "다음 결제일", "금액", "상태"].map((h) => (
                    <TableHeadCell key={h}>{h}</TableHeadCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((sub) => {
                  const isPaused = sub.status === "PAUSED";
                  const days = getDaysUntil(sub.nextBillingDate);
                  const isUpcoming = days >= 0 && days <= 7;
                  const meta = CATEGORY_META[sub.category];
                  const initials = sub.serviceName.charAt(0).toUpperCase();

                  return (
                    <TableRow
                      key={sub.id}
                      interaction
                      onClick={() => navigate(`/subscriptions/${sub.id}`)}
                      style={{
                        opacity: isPaused ? 0.6 : 1,
                        transition: "opacity 0.2s",
                        cursor: "pointer",
                      }}
                    >
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "8px",
                              background: "linear-gradient(135deg, #0066ff22, #0066ff33)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              fontWeight: "700",
                              color: "#0066FF",
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <Typography variant="body2" weight="medium" color="semantic.label.normal">
                            {sub.serviceName}
                          </Typography>
                        </div>
                      </TableCell>

                      <TableCell>
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
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="semantic.label.alternative">
                          {BILLING_CYCLE_META[sub.billingCycle].label === "월간 결제" ? "매월" : "매년"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
                              {getDDayLabel(sub.nextBillingDate)}
                            </span>
                          )}
                          <Typography variant="body2" color="semantic.label.alternative">
                            {sub.nextBillingDate}
                          </Typography>
                        </div>
                      </TableCell>

                      <TableCell>
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
                      </TableCell>

                      <TableCell>
                        <StatusToggle
                          active={sub.status === "ACTIVE"}
                          disabled={pendingIds.has(sub.id)}
                          onChange={() => toggleStatus(sub.id)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
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
                    key={sub.id}
                    onClick={() => navigate(`/subscriptions/${sub.id}`)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 20px",
                      opacity: isPaused ? 0.6 : 1,
                      borderBottom: "1px solid #f0f4f8",
                      transition: "opacity 0.2s, background-color 0.1s",
                      cursor: "pointer",
                    }}
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
                        width: "38px",
                        height: "38px",
                        borderRadius: "10px",
                        background:
                          "linear-gradient(135deg, #0066ff22, #0066ff33)",
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

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        weight="medium"
                        color="semantic.label.normal"
                        style={{ display: "block", marginBottom: "4px" }}
                      >
                        {sub.serviceName}
                      </Typography>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Typography
                          variant="caption1"
                          color="semantic.label.alternative"
                        >
                          {meta.emoji} {meta.label}
                        </Typography>
                        <span style={{ color: "#e3e8ee", fontSize: "10px" }}>
                          |
                        </span>
                        <Typography
                          variant="caption1"
                          color="semantic.label.alternative"
                        >
                          {BILLING_CYCLE_META[sub.billingCycle].label ===
                          "월간 결제"
                            ? "매월"
                            : "매년"}
                        </Typography>
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: "6px",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {isUpcoming && (
                          <span
                            style={{
                              fontSize: "10px",
                              fontWeight: "700",
                              color: "#0066FF",
                              backgroundColor: "rgba(0,102,255,0.08)",
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
                        onChange={() => toggleStatus(sub.id)}
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
