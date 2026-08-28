/**
 * Lưới dùng chung cho các container khai báo theo section (FormV2, ViewV2).
 *
 * Class Tailwind phải viết literal — Tailwind quét source như văn bản, không
 * chạy JS, nên `grid-cols-${n}` sẽ không sinh ra CSS. Union bị giới hạn theo
 * đúng map bên dưới, nên gõ `columns: 7` là lỗi biên dịch chứ không phải bố cục
 * hỏng trong im lặng (§9).
 */
export type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;

export const GRID_COLS: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

export const COL_SPAN: Record<GridColumns, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  6: "col-span-6",
  12: "col-span-12",
};
