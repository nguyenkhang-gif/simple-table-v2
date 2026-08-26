import type { ReactNode } from "react";

export type FilterMode = "server" | "client" | false;
export type SortMode = "server" | "client" | false;
export type FilterVariant = "text" | "select" | "date";

export interface CellContext<T> {
  row: T;
  value: unknown;
}

/**
 * Metadata mô tả một cột — đi cùng cột (§4), container tự phân loại
 * (filterable/sortable) mà không cần màn hình khai báo ở chỗ khác.
 */
export interface ColumnDef<T> {
  key: keyof T & string;
  label: string;
  filterable?: FilterMode;
  sortable?: SortMode;
  filterVariant?: FilterVariant;
  filterOptions?: { label: string; value: string }[];
  /** Render prop — container chỉ hiển thị, không cần hiểu nội dung ô (§3) */
  render?: (ctx: CellContext<T>) => ReactNode;
}

export interface QueryParams extends Record<string, unknown> {
  page: number;
  limit: number;
}

/**
 * Ngữ cảnh truyền cho action handler — đủ để xử lý mà không cần hỏi ngược (§6).
 */
export interface ActionContext<T, A extends string> {
  record?: T;
  selectedRows: T[];
  queryParams: QueryParams;
  refetch: () => void;
  close: (shouldRefetch?: boolean) => void;
  status: A;
}

/** Khai báo — chỉ mô tả nút, không chứa logic (§6) */
export interface ActionDecl<A extends string> {
  type: A;
  label?: string;
  icon?: ReactNode;
  disabled?: (ctx: { selectedRows: unknown[] }) => boolean;
  /** Tự vẽ nút (icon-only, dropdown...) thay vì Button mặc định của container (§3) */
  render?: (ctx: { openAction: () => void }) => ReactNode;
}

/** Xử lý — tra theo name, tách khỏi khai báo (§6) */
export interface ActionImpl<T, A extends string> {
  name: A | A[];
  run?: (ctx: ActionContext<T, A>) => void;
  render?: (ctx: ActionContext<T, A>) => ReactNode;
}

export interface ActiveAction<T, A extends string> {
  status: A;
  record?: T;
}

// --- classifyColumns.ts ---

export interface ClassifiedColumns<T> {
  all: ColumnDef<T>[];
  serverFilterColumns: ColumnDef<T>[];
  clientFilterColumns: ColumnDef<T>[];
  serverSortColumns: ColumnDef<T>[];
  clientSortColumns: ColumnDef<T>[];
}

// --- buildQueryParams.ts ---

export interface SortState {
  key: string;
  direction: "asc" | "desc";
}

export interface BuildQueryParamsInput<T> {
  classified: ClassifiedColumns<T>;
  filterValues: Record<string, unknown>;
  sorting: SortState | undefined;
  page: number;
  limit: number;
  externalParams?: Record<string, unknown>;
}

// --- useListController.ts ---

export interface ListResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListControllerConfig<T, A extends string = never> {
  columns: ColumnDef<T>[];
  fetch: (params: QueryParams) => Promise<ListResponse<T> | undefined>;
  resourceName: string;
  initialLimit?: number;
  externalParams?: Record<string, unknown>;
  actions?: ActionDecl<A>[];
  rowActions?: ActionDecl<A>[];
  handlers?: ActionImpl<T, A>[];
}

// --- DataTableV2.tsx ---

export interface DataTableV2Props<T extends { id: string }, A extends string = never>
  extends ListControllerConfig<T, A> {
  emptyMessage?: string;
  renderLoading?: () => ReactNode;
  renderError?: (error: unknown, retry: () => void) => ReactNode;
  renderEmpty?: (message: string) => ReactNode;
}
