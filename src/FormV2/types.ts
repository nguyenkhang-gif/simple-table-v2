import type { ReactNode } from "react";

export type FormValues = Record<string, unknown>;

export type FormFieldVariant =
  | "text"
  | "number"
  | "date"
  | "select"
  | "textarea"
  | "component";

/**
 * Giới hạn theo map class Tailwind viết sẵn trong `FormSection.tsx`.
 * Tailwind quét source như văn bản nên không nội suy được `grid-cols-${n}` —
 * dùng union để trạng thái không hợp lệ (vd 7 cột) không biểu diễn được (§9).
 */
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

/** Một object = một luật. Gõ sai key bị TS chặn nhờ excess property check */
export interface FormRule {
  required?: boolean;
  /** variant "number" → giá trị tối thiểu; còn lại → độ dài tối thiểu */
  min?: number;
  max?: number;
  pattern?: RegExp;
  validate?: (value: unknown, values: FormValues) => string | undefined;
  message?: string;
}

export interface FormControlContext {
  value: unknown;
  onChange: (value: unknown) => void;
}

export interface FormFieldDecl<T = FormValues> {
  name: keyof T & string;
  label: string;
  variant: FormFieldVariant;
  placeholder?: string;
  description?: string;
  /** Số cột chiếm trong lưới của section. Mặc định 1 */
  colSpan?: GridColumns;
  /** Dùng khi variant: "select" */
  options?: { label: string; value: string }[];
  rules?: FormRule[];
  defaultValue?: unknown;
  /** Cascading — ẩn field tuỳ giá trị field khác; field ẩn không tham gia validate */
  hidden?: (values: FormValues) => boolean;
  /** Dùng khi variant: "component" — UI hoàn toàn tuỳ biến (§3) */
  render?: (ctx: FormControlContext) => ReactNode;
}

export interface FormSectionDecl<T = FormValues> {
  key: string;
  title: string;
  description?: string;
  /** Số cột lưới trong section. Mặc định 2 */
  columns?: GridColumns;
  /** Mở sẵn khi vào form. Mặc định true */
  defaultOpen?: boolean;
  fields: FormFieldDecl<T>[];
}

export interface FormV2Props<T = FormValues> {
  sections: FormSectionDecl<T>[];
  defaultValues?: Partial<T>;
  onSubmit: (values: T) => void | Promise<void>;
  onCancel?: () => void;
  submitText?: string;
  cancelText?: string;
  submitting?: boolean;
  /**
   * Gắn lên `<form id>`. Để nút submit nằm NGOÀI form (vd trong `SheetFooter`)
   * vẫn submit được: `<Button type="submit" form={formId}>`. Trình duyệt tra
   * theo id trong document nên hoạt động cả khi form bị portal ra ngoài.
   * Không khai thì tự sinh bằng `useId` — nhưng lúc đó cha không biết id để
   * tham chiếu, nên dùng `hideFooter` thì phải khai tường minh.
   */
  formId?: string;
  /** Ẩn footer mặc định để cha tự đặt nút ở chỗ khác */
  hideFooter?: boolean;
}
