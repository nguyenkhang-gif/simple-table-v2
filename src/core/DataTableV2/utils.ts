import type { ReactNode } from "react";
import type { ColumnDef, FilterFieldDecl } from "./types";

/**
 * Hàm thuần dùng chung trong container — không hook, test được mà không cần
 * render (§11 bước 2).
 */

/** Hiển thị mặc định cho ô không khai `render` */
export function defaultCellValue<T>(row: T, col: ColumnDef<T>): ReactNode {
  const value = row[col.key];
  return value === null || value === undefined ? "" : String(value);
}

/** Giá trị filter khởi tạo, lấy từ `defaultValue` của từng field */
export function buildInitialFilterValues(filters?: FilterFieldDecl[]): Record<string, unknown> {
  const initial: Record<string, unknown> = {};
  for (const field of filters ?? []) {
    if (field.defaultValue !== undefined) initial[field.key] = field.defaultValue;
  }
  return initial;
}
