import type { ReactNode } from "react";
import type { GridColumns } from "@/lib/grid";

export type ViewFormat =
  | "text"
  | "currency"
  | "date"
  | "badge"
  | "boolean"
  | "component";

export interface ViewFieldDecl<T> {
  name: keyof T & string;
  label: string;
  /** Mặc định "text" */
  format?: ViewFormat;
  /** Số cột chiếm trong lưới của section. Mặc định 1 */
  colSpan?: GridColumns;
  /** format: "badge" — map giá trị sang class Tailwind */
  badgeColors?: Record<string, string>;
  /** Ẩn field tuỳ theo bản ghi */
  hidden?: (record: T) => boolean;
  /**
   * format: "component" — nhận cả `record` chứ không chỉ `value`, vì ô chi tiết
   * thường ghép từ nhiều trường. Cũng là chỗ để hiển thị giá trị tính toán:
   * nhập hàm format từ `./formatters` để không phải viết lại cách định dạng.
   */
  render?: (ctx: { value: unknown; record: T }) => ReactNode;
}

export interface ViewSectionDecl<T> {
  key: string;
  title: string;
  description?: string;
  /** Số cột lưới trong section. Mặc định 2 */
  columns?: GridColumns;
  /** Mở sẵn khi vào. Mặc định true */
  defaultOpen?: boolean;
  fields: ViewFieldDecl<T>[];
}

export interface ViewV2Props<T> {
  sections: ViewSectionDecl<T>[];
  record: T;
}

export type { GridColumns };
