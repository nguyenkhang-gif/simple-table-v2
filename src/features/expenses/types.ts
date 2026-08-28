export type ExpenseCategory = "food" | "transport" | "shopping" | "bills" | "entertainment";

export interface Metadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Expense {
  id: string;
  category: ExpenseCategory;
  amount: number;
  note: string;
  date: string;
}

export interface FetchExpensesParams {
  page?: number;
  limit?: number;
  category?: ExpenseCategory;
  note?: string;
  /** Khoảng ngày, ISO yyyy-MM-dd — filter `date` được duỗi thành hai param này */
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface FetchExpensesProps {
  params?: FetchExpensesParams;
}

export interface ExpenseResponse {
  meta: Metadata;
  data: Expense[];
}
