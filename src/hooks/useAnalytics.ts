import { useState, useEffect } from "react";
import {
  getMonthlyExpense,
  getCategoryExpenses,
  getExpenseTrends,
  getMonthlyExpenseDetails,
} from "../api/expenses";
import type {
  MonthlyExpense,
  CategoryExpenseData,
  TrendData,
  MonthlyDetailData,
} from "../type/expenses";

export interface AnalyticsData {
  summary: MonthlyExpense | null;
  categories: CategoryExpenseData | null;
  trends: TrendData | null;
  details: MonthlyDetailData | null;
}

export function useAnalytics() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [retryCount, setRetryCount] = useState(0);
  const [data, setData] = useState<AnalyticsData>({
    summary: null,
    categories: null,
    trends: null,
    details: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchAll() {
      try {
        const [summaryRes, catRes, trendRes, detailRes] = await Promise.all([
          getMonthlyExpense({ year, month }),
          getCategoryExpenses({ year, month }),
          getExpenseTrends({ baseYear: year, baseMonth: month }),
          getMonthlyExpenseDetails({ year, month }),
        ]);
        if (cancelled) return;
        setData({
          summary: summaryRes.data,
          categories: catRes.data,
          trends: trendRes.data,
          details: detailRes.data,
        });
      } catch {
        if (!cancelled) setError("데이터를 불러오지 못했습니다. 다시 시도해주세요.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, [year, month, retryCount]);

  const prevMonth = () => {
    if (month === 1) {
      setYear((y) => y - 1);
      setMonth(12);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 12) {
      setYear((y) => y + 1);
      setMonth(1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const retry = () => {
    setRetryCount((c) => c + 1);
  };

  return {
    ...data,
    loading,
    error,
    year,
    month,
    isCurrentMonth,
    prevMonth,
    nextMonth,
    retry,
  };
}
