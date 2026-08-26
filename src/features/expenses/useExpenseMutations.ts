import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createExpenseApi, deleteExpenseApi } from "./expensesApi";
import type { Expense } from "./types";

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<Expense, "id">) => createExpenseApi(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpenseApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
  });
}
