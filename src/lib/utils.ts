import { clsx, type ClassValue } from "clsx"
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
 */
export function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true
  if (Array.isArray(value) && value.length === 0) return true
  return false
}
