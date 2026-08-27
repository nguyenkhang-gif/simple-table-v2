import type { Expense, ExpenseResponse, FetchExpensesProps } from "./types";

function buildQueryString(params: object = {}): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    // Mảng phải append từng phần tử — String(["a","b"]) sẽ ra "a,b", mất cấu trúc
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item));
    } else {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const getAllExpensesApi = async (
  props?: FetchExpensesProps,
): Promise<ExpenseResponse | undefined> => {
  try {
    const res = await fetch(`/api/expenses${buildQueryString(props?.params)}`);
    if (!res.ok) throw new Error(`getAllExpensesApi failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("getAllExpensesApi failed", error);
    return undefined;
  }
};

export const createExpenseApi = async (
  input: Omit<Expense, "id">,
): Promise<Expense | undefined> => {
  try {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`createExpenseApi failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("createExpenseApi failed", error);
    return undefined;
  }
};

export const updateExpenseApi = async (
  id: string,
  input: Omit<Expense, "id">,
): Promise<Expense | undefined> => {
  try {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) throw new Error(`updateExpenseApi failed: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("updateExpenseApi failed", error);
    return undefined;
  }
};

export const deleteExpenseApi = async (id: string): Promise<boolean> => {
  try {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    return res.ok;
  } catch (error) {
    console.error("deleteExpenseApi failed", error);
    return false;
  }
};
