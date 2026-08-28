import type { BuildQueryParamsInput, DateRangeValue, QueryParams } from "./types";
import { isEmptyValue } from "@/lib/utils";

/**
 * Nguồn sự thật duy nhất (§5) — mọi thứ ảnh hưởng tới request hội tụ ở đây.
 * Hàm thuần, tách khỏi useMemo để test được không cần render (§5, §11 bước 2).
 */
export function buildQueryParams<T>(input: BuildQueryParamsInput<T>): QueryParams {
  const { classified, filters, filterValues, sorting, page, limit, externalParams } = input;

  // Filter khai độc lập — key gửi thẳng lên fetch, không cần là cột nào
  const fieldsByKey = new Map(filters?.map((f) => [f.key, f]) ?? []);
  const activeFilters: Record<string, unknown> = {};
  for (const key of Object.keys(filterValues)) {
    const field = fieldsByKey.get(key);
    const value = filterValues[key];
    if (!field || isEmptyValue(value)) continue;

    /**
     * Khoảng ngày là hai mốc nhưng chỉ một field. Duỗi ra hai param vô hướng
     * ngay tại đây — phễu duy nhất của request (§5) — để mọi tầng phía sau vẫn
     * chỉ thấy chuỗi. Nếu để object đi tiếp, `buildQueryString` gọi `String()`
     * sẽ gửi lên `date=[object Object]`.
     */
    if (field.variant === "date-range") {
      const { from, to } = (value ?? {}) as DateRangeValue;
      if (from) activeFilters[`${key}From`] = from;
      if (to) activeFilters[`${key}To`] = to;
      continue;
    }

    activeFilters[key] = value;
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
