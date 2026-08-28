import type { BuildQueryParamsInput, QueryParams } from "./types";
import { isEmptyValue } from "@/lib/utils";

/**
 * Nguồn sự thật duy nhất (§5) — mọi thứ ảnh hưởng tới request hội tụ ở đây.
 * Hàm thuần, tách khỏi useMemo để test được không cần render (§5, §11 bước 2).
 */
export function buildQueryParams<T>(input: BuildQueryParamsInput<T>): QueryParams {
  const { classified, filters, filterValues, sorting, page, limit, externalParams } = input;

  // Filter khai độc lập — key gửi thẳng lên fetch, không cần là cột nào
  const filterKeys = new Set<string>(filters?.map((f) => f.key) ?? []);
  const activeFilters: Record<string, unknown> = {};
  for (const key of Object.keys(filterValues)) {
    if (filterKeys.has(key) && !isEmptyValue(filterValues[key])) {
      activeFilters[key] = filterValues[key];
    }
  }

  const serverSortKeys = new Set<string>(classified.serverSortColumns.map((c) => c.key));
  const sort =
    sorting && serverSortKeys.has(sorting.key)
      ? { sortBy: sorting.key, sortDirection: sorting.direction }
      : {};

  return {
    ...externalParams,
    ...activeFilters,
    ...sort,
    page,
    limit,
  };
}
