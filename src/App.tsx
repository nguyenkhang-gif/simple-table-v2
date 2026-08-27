import { useExpenses } from "./features/expenses/useExpenses";
import { useDeleteExpense } from "./features/expenses/useExpenseMutations";
import type { ExpenseCategory } from "./features/expenses/types";
import { AddExpenseForm } from "./features/expenses/components/AddExpenseForm";
import { useDarkMode } from "./hooks/useDarkMode";

const CATEGORY_BADGE: Record<string, string> = {
  food: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  transport: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shopping: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  bills: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const CATEGORY_OPTIONS: ExpenseCategory[] = [
  "food",
  "transport",
  "shopping",
  "bills",
  "entertainment",
];

function App() {
  const { rows, meta, isLoading, isFetching, error, page, setPage, category, updateCategory } =
    useExpenses(5);
  const deleteExpense = useDeleteExpense();
  const { dark, toggle } = useDarkMode();

  return (
    <div className="mx-auto max-w-3xl p-8 font-sans text-gray-900 dark:text-gray-100">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Expense tracker</h1>
        <button
          onClick={toggle}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <AddExpenseForm />

      <label className="mb-4 block text-left text-sm">
        Category:{" "}
        <select
          value={category ?? ""}
          onChange={(e) => updateCategory(e.target.value ? (e.target.value as never) : undefined)}
          className="rounded-md border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="">All</option>
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      {error && <p className="mb-2 text-red-600 dark:text-red-400">Error: {String(error)}</p>}

      <table
        className="w-full border-collapse text-left text-sm transition-opacity"
        style={{ opacity: isFetching ? 0.5 : 1 }}
      >
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">ID</th>
            <th className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">Category</th>
            <th className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">Note</th>
            <th className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">Amount</th>
            <th className="border-b border-gray-300 px-3 py-2 dark:border-gray-700">Date</th>
            <th className="border-b border-gray-300 px-3 py-2 dark:border-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-3 py-4 text-center">
                Loading...
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-3 py-4 text-center">
                No data
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td className="border-b border-gray-200 px-3 py-2 dark:border-gray-800">{r.id}</td>
                <td className="border-b border-gray-200 px-3 py-2 dark:border-gray-800">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${CATEGORY_BADGE[r.category]}`}>
                    {r.category}
                  </span>
                </td>
                <td className="border-b border-gray-200 px-3 py-2 dark:border-gray-800">
                  {r.note}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 text-right tabular-nums dark:border-gray-800">
                  {r.amount.toLocaleString()}đ
                </td>
                <td className="border-b border-gray-200 px-3 py-2 dark:border-gray-800">
                  {r.date}
                </td>
                <td className="border-b border-gray-200 px-3 py-2 dark:border-gray-800">
                  <button
                    onClick={() => deleteExpense.mutate(r.id)}
                    disabled={deleteExpense.isPending}
                    className="text-red-600 hover:underline disabled:opacity-40 dark:text-red-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {meta && (
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
          >
            ← Prev
          </button>
          <span>
            Page {meta.page}/{meta.totalPages} — {meta.total} records total
          </span>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-40 dark:border-gray-600"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
