import type { ReactNode } from "react";

export type SortMode = "server" | "client" | false;

export interface CellContext<T> {
  row: T;
  value: unknown;
}

/**
 * Metadata mô tả một cột — đi cùng cột (§4). Cột chỉ lo hiển thị + sort;
 * filter khai riêng ở `FilterFieldDecl` để lọc được cả field không phải cột.
 */
export interface ColumnDef<T> {
  key: keyof T & string;
  label: string;
  sortable?: SortMode;
  /** Render prop — container chỉ hiển thị, không cần hiểu nội dung ô (§3) */
  render?: (ctx: CellContext<T>) => ReactNode;
}

// --- Filter khai báo độc lập, tách khỏi columns ---

export type FilterVariant = "text" | "select" | "component" | "date-range";

export type DatePreset = "today" | "7d" | "30d";

/**
 * Giá trị của filter `date-range`.
 *
 * `preset` chỉ để UI biết mục nào đang được chọn — server không bao giờ thấy nó.
 * Preset được quy đổi ra `from`/`to` ngay lúc bấm, nên request luôn tự mô tả đủ
 * và queryKey đổi theo đúng khoảng ngày thật. Gửi thẳng "7d" lên server thì cùng
 * một key sẽ trỏ sang khoảng khác vào hôm sau — cache sai.
 */
export interface DateRangeValue {
  preset?: DatePreset;
  /** ISO yyyy-MM-dd */
  from?: string;
  to?: string;
}

export interface FilterFieldDecl {
  /** Tên param gửi thẳng lên fetch — không cần trùng key nào trong columns */
  key: string;
  /** Hiển thị phía trên ô nhập */
  label: string;
  variant: FilterVariant;
  /** Chữ gợi ý trong ô — không khai thì suy từ `label` */
  placeholder?: string;
  /** Class Tailwind quy định bề rộng, vd "w-64". Mặc định "w-48" */
  width?: string;
  /** Dùng khi variant: "select" */
  options?: { label: string; value: string }[];
  /** Dùng khi variant: "date-range" — không khai thì hiện đủ cả ba preset */
  presets?: DatePreset[];
  defaultValue?: unknown;
  /** Cascading — ẩn field này tuỳ theo giá trị của field khác */
  hidden?: (values: Record<string, unknown>) => boolean;
  /** Dùng khi variant: "component" — UI hoàn toàn tuỳ biến (§3) */
  render?: (ctx: { value: unknown; onChange: (value: unknown) => void }) => ReactNode;
}

export interface QueryParams extends Record<string, unknown> {
  page: number;
  limit: number;
}

// --- Phân trang (thuần trình bày, controller không cần biết) ---

export type PaginationAlign = "left" | "center" | "right";

export interface PaginationConfig {
  /** Mặc định "center" */
  align?: PaginationAlign;
  /** Số dòng cho chọn. Truyền [] để ẩn ô chọn. Mặc định [5, 10, 20, 50] */
  pageSizeOptions?: number[];
  /** Hiện "Page x/y — n records total". Mặc định true */
  showTotal?: boolean;
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
  /** Biến thể nút mặc định của container */
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary" | "link";
  /** Class bổ sung cho nút mặc định — gộp qua `cn()` nên ghi đè được class có sẵn */
  className?: string;
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
  filters?: FilterFieldDecl[];
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
  filters?: FilterFieldDecl[];
  initialLimit?: number;
  externalParams?: Record<string, unknown>;
  actions?: ActionDecl<A>[];
  rowActions?: ActionDecl<A>[];
  handlers?: ActionImpl<T, A>[];
}

// --- DataTableV2.tsx ---

export interface DataTableV2Props<T extends { id: string }, A extends string = never>
  extends ListControllerConfig<T, A> {
  pagination?: PaginationConfig;
  emptyMessage?: string;
  renderLoading?: () => ReactNode;
  renderError?: (error: unknown, retry: () => void) => ReactNode;
  renderEmpty?: (message: string) => ReactNode;
}
