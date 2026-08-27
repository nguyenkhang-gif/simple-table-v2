import { useState, type FormEvent } from "react";
import { useCreateExpense } from "../useExpenseMutations";
import type { ExpenseCategory } from "../types";

const CATEGORY_OPTIONS: ExpenseCategory[] = [
  "food",
  "transport",
  "shopping",
  "bills",
  "entertainment",
];

export function AddExpenseForm() {
  const createExpense = useCreateExpense();
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("food");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!note || !amount) return;
    createExpense.mutate({
      note,
      amount: Number(amount),
      category,
      date: new Date().toISOString().slice(0, 10),
    });
    setNote("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note"
        className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
      />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Amount"
        className="w-28 rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
        className="rounded-md border border-gray-300 px-2 py-1 text-sm dark:border-gray-600 dark:bg-gray-800"
      >
        {CATEGORY_OPTIONS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={createExpense.isPending}
        className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {createExpense.isPending ? "Adding..." : "+ Add"}
      </button>
    </form>
  );
}
