import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllExpensesApi } from "./expensesApi";
import type { ExpenseCategory, FetchExpensesParams } from "./types";

export function useExpenses(limit = 10) {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<ExpenseCategory | undefined>(undefined);

  // Nguồn sự thật duy nhất — mọi thứ ảnh hưởng tới request hội tụ ở đây (§5)
  const params: FetchExpensesParams = useMemo(
    () => ({ page, limit, category }),
    [page, limit, category],
  );

  const query = useQuery({
    queryKey: ["expenses", params],
    queryFn: () => getAllExpensesApi({ params }),
    placeholderData: keepPreviousData, // giữ trang cũ khi đang fetch trang mới, tránh nháy UI
  });

  // Reset trang tại nơi gây thay đổi, không so sánh ngược trong useMemo (§8.2)
  const updateCategory = useCallback((next: ExpenseCategory | undefined) => {
    setCategory(next);
    setPage(1);
  }, []);

  return {
    rows: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    page,
    setPage,
    category,
    updateCategory,
    refetch: query.refetch,
  };
}
