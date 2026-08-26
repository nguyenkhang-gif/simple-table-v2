import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { classifyColumns } from "./classifyColumns";
import { buildQueryParams } from "./buildQueryParams";
import type { ActiveAction, ListControllerConfig, SortState } from "./types";

export function useListController<T extends { id: string }, A extends string = never>(
  config: ListControllerConfig<T, A>,
) {
  const { columns, fetch, resourceName, initialLimit = 10, externalParams } = config;

  const classified = useMemo(() => classifyColumns(columns), [columns]);

  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({});
  const [sorting, setSorting] = useState<SortState | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<ActiveAction<T, A> | undefined>(undefined);

  // Nguồn sự thật duy nhất (§5) — mọi thứ ảnh hưởng tới request hội tụ ở đây
  const queryParams = useMemo(
    () =>
      buildQueryParams({
        classified,
        filterValues,
        sorting,
        page,
        limit,
        externalParams,
      }),
    [classified, filterValues, sorting, page, limit, externalParams],
  );

  const query = useQuery({
    queryKey: [resourceName, queryParams],
    queryFn: () => fetch(queryParams),
    placeholderData: keepPreviousData,
  });
  const { refetch } = query;

  // Lọc + sort client-side — cột filterable/sortable: "client" không đi qua queryParams (§4)
  const processedRows = useMemo(() => {
    let rows = query.data?.data ?? [];

    if (classified.clientFilterColumns.length > 0) {
      rows = rows.filter((row) =>
        classified.clientFilterColumns.every((col) => {
          const filterValue = filterValues[col.key];
          if (filterValue === undefined || filterValue === "") return true;
          return String(row[col.key]) === String(filterValue);
        }),
      );
    }

    if (sorting) {
      const isClientSort = classified.clientSortColumns.some((c) => c.key === sorting.key);
      if (isClientSort) {
        const { key, direction } = sorting;
        rows = [...rows].sort((a, b) => {
          const av = a[key as keyof T];
          const bv = b[key as keyof T];
          if (av === bv) return 0;
          const cmp = av > bv ? 1 : -1;
          return direction === "asc" ? cmp : -cmp;
        });
      }
    }

    return rows;
  }, [query.data, classified.clientFilterColumns, classified.clientSortColumns, filterValues, sorting]);

  // Reset state phái sinh tại nơi gây thay đổi, không suy luận ngược (§8.2, §10)
  const updateFilterValue = useCallback((key: string, value: unknown) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
    setSelectedIds([]);
  }, []);

  const updateSorting = useCallback((next: SortState | undefined) => {
    setSorting(next);
    setPage(1);
  }, []);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  // Action host state — tách khai báo khỏi xử lý (§6)
  const openAction = useCallback((status: A, record?: T) => {
    setActiveAction({ status, record });
  }, []);

  const closeAction = useCallback(
    (shouldRefetch?: boolean) => {
      setActiveAction(undefined);
      if (shouldRefetch) refetch();
    },
    [refetch],
  );

  return {
    rows: processedRows,
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch,

    queryParams,
    classified,

    page,
    setPage,
    filterValues,
    updateFilterValue,
    sorting,
    updateSorting,
    selectedIds,
    toggleSelection,
    clearSelection: () => setSelectedIds([]),

    activeAction,
    openAction,
    closeAction,
  };
}
