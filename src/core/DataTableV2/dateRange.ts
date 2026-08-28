import { format, parseISO, subDays } from "date-fns";
import type { DatePreset, DateRangeValue } from "./types";

/**
 * Quy đổi preset và dựng nhãn — hàm thuần, tách khỏi component để test được
 * không cần render (§11 bước 2).
 */

/** Dạng lưu trữ và dạng gửi lên server. Sắp theo từ điển trùng sắp theo thời gian. */
const ISO_DATE = "yyyy-MM-dd";

export const DATE_PRESETS: DatePreset[] = ["today", "7d", "30d"];

export const PRESET_LABELS: Record<DatePreset, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
};

/** Số ngày lùi về, tính cả hôm nay — "7 ngày qua" gồm hôm nay và 6 ngày trước */
const PRESET_DAYS: Record<DatePreset, number> = {
  today: 1,
  "7d": 7,
  "30d": 30,
};

/**
 * Mọi preset đều kết thúc ở hết hôm nay.
 * `today` nhận vào được để test cố định thời điểm.
 */
export function resolvePreset(preset: DatePreset, today = new Date()): DateRangeValue {
  return {
    preset,
    from: format(subDays(today, PRESET_DAYS[preset] - 1), ISO_DATE),
    to: format(today, ISO_DATE),
  };
}

export function toISODate(date: Date): string {
  return format(date, ISO_DATE);
}

/** Chuỗi ISO → Date cho react-day-picker. Chuỗi hỏng thì bỏ qua thay vì ném lỗi. */
export function fromISODate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const date = parseISO(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Nhãn trên nút: tên preset nếu đang chọn preset, còn lại là khoảng ngày. */
export function formatRangeLabel(value: DateRangeValue | undefined): string {
  if (!value?.from && !value?.to) return "All time";
  if (value?.preset) return PRESET_LABELS[value.preset];

  const from = fromISODate(value?.from);
  const to = fromISODate(value?.to);
  const short = (date: Date) => format(date, "dd/MM");

  // Chọn tay có thể mới xong một đầu — react-day-picker đặt `from` trước
  if (from && to) return `${short(from)} – ${short(to)}`;
  if (from) return `From ${short(from)}`;
  if (to) return `Until ${short(to)}`;
  return "All time";
}
