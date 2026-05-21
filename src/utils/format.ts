import type { BillingCycle } from "../type/subscribe";

export function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString("ko-KR")}`;
}

export function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDDayLabel(dateStr: string): string {
  const days = getDaysUntil(dateStr);
  if (days === 0) return "D-Day";
  if (days > 0) return `D-${days}`;
  return `D+${Math.abs(days)}`;
}

export function getNextBillingDate(
  billingDay: number,
  billingCycle: BillingCycle,
  billingMonth: number | null,
): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const pad = (n: number) => String(n).padStart(2, "0");

  if (billingCycle === "MONTHLY") {
    if (billingDay >= day) {
      return `${year}-${pad(month)}-${pad(billingDay)}`;
    }
    // next month — Date constructor month is 0-indexed, so month (1-indexed) = next month
    const next = new Date(year, month, billingDay);
    return next.toISOString().split("T")[0];
  }

  // YEARLY
  const bMonth = billingMonth ?? 1;
  if (bMonth > month || (bMonth === month && billingDay >= day)) {
    return `${year}-${pad(bMonth)}-${pad(billingDay)}`;
  }
  return `${year + 1}-${pad(bMonth)}-${pad(billingDay)}`;
}
