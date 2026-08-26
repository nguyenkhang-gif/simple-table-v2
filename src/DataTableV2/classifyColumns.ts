import type { ClassifiedColumns, ColumnDef } from "./types";

/**
 * Duyệt columns một lần, phân loại theo metadata filterable/sortable (§4).
 * Hàm thuần — không hook, test được mà không cần render (§11 bước 2).
 */
export function classifyColumns<T>(columns: ColumnDef<T>[]): ClassifiedColumns<T> {
  return columns.reduce<ClassifiedColumns<T>>(
    (acc, col) => {
      if (col.filterable === "server") acc.serverFilterColumns.push(col);
      if (col.filterable === "client") acc.clientFilterColumns.push(col);
      if (col.sortable === "server") acc.serverSortColumns.push(col);
      if (col.sortable === "client") acc.clientSortColumns.push(col);
      return acc;
    },
    {
      all: columns,
      serverFilterColumns: [],
      clientFilterColumns: [],
      serverSortColumns: [],
      clientSortColumns: [],
    },
  );
}
