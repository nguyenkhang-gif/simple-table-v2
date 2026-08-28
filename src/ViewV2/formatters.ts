/**
 * Hàm thuần cho từng format — không hook, test được không cần render
 * (§11 bước 2).
 *
 * Export ra ngoài có chủ đích: field cần **giá trị tính toán** thì dùng
 * `format: "component"` + `render`, rồi gọi lại chính các hàm này thay vì tự
 * viết lại cách định dạng:
 *
 * ```tsx
 * render: ({ record }) => <>{formatCurrency(record.amount * record.quantity)}</>
 * ```
 */

/** Ô rỗng hiển thị thống nhất một ký tự này */
export const EMPTY_DISPLAY = "—";

export function formatText(value: unknown): string {
  return String(value);
}

/** 1234567 → "1.234.567đ" */
export function formatCurrency(value: unknown): string {
  const amount = Number(value);
  if (Number.isNaN(amount)) return formatText(value);
  return `${amount.toLocaleString("vi-VN")}đ`;
}

/** "2026-08-27" → "27/08/2026". Chuỗi không parse được thì trả nguyên văn */
export function formatDate(value: unknown): string {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return formatText(value);
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatBoolean(value: unknown): string {
  return value ? "Yes" : "No";
}
