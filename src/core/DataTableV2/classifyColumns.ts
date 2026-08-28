import type { ClassifiedColumns, ColumnDef } from "./types";

/**
 * Duyệt columns một lần, phân loại theo metadata `sortable` (§4).
 * Filter không còn suy từ cột — khai riêng qua `FilterFieldDecl`.
 * Hàm thuần — không hook, test được mà không cần render (§11 bước 2).
 */
export function classifyColumns<T>(columns: ColumnDef<T>[]): ClassifiedColumns<T> {
  return columns.reduce<ClassifiedColumns<T>>(
    (acc, col) => {
      if (col.sortable === "server") acc.serverSortColumns.push(col);
      if (col.sortable === "client") acc.clientSortColumns.push(col);
      return acc;
    },
    {
      all: columns,
      serverSortColumns: [],
      clientSortColumns: [],
    },
  );
}
