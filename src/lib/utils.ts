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
