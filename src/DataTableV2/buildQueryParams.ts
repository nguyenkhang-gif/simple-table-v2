import type { BuildQueryParamsInput, QueryParams } from "./types";

/**
 * Nguồn sự thật duy nhất (§5) — mọi thứ ảnh hưởng tới request hội tụ ở đây.
 * Hàm thuần, tách khỏi useMemo để test được không cần render (§5, §11 bước 2).
 */
export function buildQueryParams<T>(input: BuildQueryParamsInput<T>): QueryParams {
  const { classified, filterValues, sorting, page, limit, externalParams } = input;

  const serverFilterKeys = new Set<string>(classified.serverFilterColumns.map((c) => c.key));
  const serverFilters: Record<string, unknown> = {};
  for (const key of Object.keys(filterValues)) {
    if (serverFilterKeys.has(key) && filterValues[key] !== undefined) {
      serverFilters[key] = filterValues[key];
    }
  }

  const serverSortKeys = new Set<string>(classified.serverSortColumns.map((c) => c.key));
  const sort =
    sorting && serverSortKeys.has(sorting.key)
      ? { sortBy: sorting.key, sortDirection: sorting.direction }
      : {};

  return {
    ...externalParams,
    ...serverFilters,
    ...sort,
    page,
    limit,
  };
}
