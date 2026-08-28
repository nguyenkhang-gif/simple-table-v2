import { clsx, type ClassValue } from "clsx"
// Subpath chứ không phải `{ isPlainObject } from "lodash"`: lodash là CJS, Vite
// xử lý được nhưng Node thuần thì không — mà isEmptyValue nằm trong nhóm hàm
// thuần cố ý tách ra để chạy/test được không cần render (§11 bước 2).
import isPlainObject from "lodash/isPlainObject"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Dùng ở nhánh `default` của switch trên union type — thêm giá trị vào union mà
 * quên viết `case` sẽ là lỗi biên dịch ngay tại đây.
 */
export function assertNever(value: never, context = "value"): never {
  throw new Error(`Unhandled ${context}: ${String(value)}`)
}

/**
 * Rỗng theo nghĩa "không có gì để gửi đi / không có gì để hiển thị".
 * Dùng chung giữa các container để một ô trống được hiểu giống nhau ở mọi nơi.
 *
 * Object thuần rỗng khi mọi giá trị bên trong đều rỗng — nếu không, filter
 * date-range xoá sạch còn lại `{ from: undefined, to: undefined }` sẽ bị tính là
 * "đang lọc" và nút Clear của FilterBar không bao giờ tự ẩn.
 */
export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true
  if (Array.isArray(value)) return value.length === 0
  if (isPlainObject(value)) return Object.values(value).every(isEmptyValue)
  return false
}
