import { useCallback, useMemo, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { classifyColumns } from './classifyColumns'
import { buildQueryParams } from './buildQueryParams'
import { buildInitialFilterValues } from './utils'
import type { ActiveAction, ListControllerConfig, SortState } from './types'

export function useListController<T extends { id: string }, A extends string = never>(
  config: ListControllerConfig<T, A>,
) {
  const { columns, fetch, resourceName, filters, initialLimit = 10, externalParams } = config

  const classified = useMemo(() => classifyColumns(columns), [columns])
  const initialFilterValues = useMemo(() => buildInitialFilterValues(filters), [filters])

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(initialLimit)
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>(initialFilterValues)
  const [sorting, setSorting] = useState<SortState | undefined>(undefined)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeAction, setActiveAction] = useState<ActiveAction<T, A> | undefined>(undefined)

  // Nguồn sự thật duy nhất (§5) — mọi thứ ảnh hưởng tới request hội tụ ở đây
  const queryParams = useMemo(
    () =>
      buildQueryParams({
        classified,
        filters,
        filterValues,
        sorting,
        page,
        limit,
        externalParams,
      }),
    [classified, filters, filterValues, sorting, page, limit, externalParams],
  )

  const query = useQuery({
    queryKey: [resourceName, queryParams],
    queryFn: () => fetch(queryParams),
    placeholderData: keepPreviousData,
  })
  const { refetch } = query

  // Sort client-side — cột sortable: "client" không đi qua queryParams (§4)
  const processedRows = useMemo(() => {
    const rows = query.data?.data ?? []
    if (!sorting) return rows

    const isClientSort = classified.clientSortColumns.some((c) => c.key === sorting.key)
    if (!isClientSort) return rows

    const { key, direction } = sorting
    return [...rows].sort((a, b) => {
      const av = a[key as keyof T]
      const bv = b[key as keyof T]
      if (av === bv) return 0
      const cmp = av > bv ? 1 : -1
      return direction === 'asc' ? cmp : -cmp
    })
  }, [query.data, classified.clientSortColumns, sorting])

  // Reset state phái sinh tại nơi gây thay đổi, không suy luận ngược (§8.2, §10)
  const updateFilterValue = useCallback((key: string, value: unknown) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }))
    setPage(1)
    setSelectedIds([])
  }, [])

  const clearFilters = useCallback(() => {
    setFilterValues(initialFilterValues)
    setPage(1)
    setSelectedIds([])
  }, [initialFilterValues])

  const updateSorting = useCallback((next: SortState | undefined) => {
    setSorting(next)
    setPage(1)
  }, [])

  // Đổi số dòng thì trang cũ vô nghĩa — reset ngay tại nguồn (§8.2)
  const updateLimit = useCallback((next: number) => {
    setLimit(next)
    setPage(1)
    setSelectedIds([])
  }, [])

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  // Action host state — tách khai báo khỏi xử lý (§6)
  const openAction = useCallback((status: A, record?: T) => {
    setActiveAction({ status, record })
  }, [])

  const closeAction = useCallback(
    (shouldRefetch?: boolean) => {
      setActiveAction(undefined)
      if (shouldRefetch) refetch()
    },
    [refetch],
  )

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
    limit,
    updateLimit,
    filterValues,
    initialFilterValues,
    updateFilterValue,
    clearFilters,
    sorting,
    updateSorting,
    selectedIds,
    toggleSelection,
    clearSelection: () => setSelectedIds([]),

    activeAction,
    openAction,
    closeAction,
  }
}
