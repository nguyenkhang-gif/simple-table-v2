import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { DataTableV2 } from "./DataTableV2/DataTableV2";
import type {
  ActionDecl,
  ActionImpl,
  ColumnDef,
  FilterFieldDecl,
} from "./DataTableV2/types";
import { getAllExpensesApi } from "./features/expenses/expensesApi";
import type { Expense } from "./features/expenses/types";
import { DeleteExpenseDialog } from "./features/expenses/components/DeleteExpenseDialog";

type ExpenseAction = "DELETE";

export function DataTableV2Demo() {
  const columns = useMemo<ColumnDef<Expense>[]>(
    () => [
      { key: "id", label: "ID" },
      { key: "category", label: "Category" },
      { key: "note", label: "Note" },
      {
        key: "amount",
        label: "Amount",
        sortable: "client",
        render: ({ value }) => `${(value as number).toLocaleString()}đ`,
      },
      { key: "date", label: "Date", sortable: "server" },
    ],
    [],
  );

  // Filter khai độc lập — không cần là cột nào trong bảng
  const filters = useMemo<FilterFieldDecl[]>(
    () => [
      {
        key: "category",
        label: "Category",
        variant: "select",
        placeholder: "All categories",
        width: "w-44",
        options: [
          { label: "food", value: "food" },
          { label: "transport", value: "transport" },
          { label: "shopping", value: "shopping" },
          { label: "bills", value: "bills" },
          { label: "entertainment", value: "entertainment" },
        ],
      },
      {
        key: "note",
        label: "Note",
        variant: "text",
        placeholder: "e.g. Coffee, Bus ticket...",
        width: "w-64",
      },
      // Cascading — chỉ hiện khi đã chọn danh mục "food"
      {
        key: "dish",
        label: "Dish",
        variant: "text",
        placeholder: "e.g. Beef noodles",
        width: "w-40",
        hidden: (values) => values.category !== "food",
      },
    ],
    [],
  );

  const rowActions = useMemo<ActionDecl<ExpenseAction>[]>(
    () => [{ type: "DELETE", label: "Delete", icon: <Trash2 className="size-4" /> }],
    [],
  );

  const actionHandlers = useMemo<ActionImpl<Expense, ExpenseAction>[]>(
    () => [
      {
        name: "DELETE",
        render: ({ record, close }) => <DeleteExpenseDialog record={record} close={close} />,
      },
    ],
    [],
  );

  return (
    <div className="mx-auto max-w-6xl p-8 font-sans">
      <h1 className="mb-4 text-xl font-semibold">DataTableV2 — expenses demo</h1>
      <DataTableV2
        columns={columns}
        fetch={(params) => getAllExpensesApi({ params })}
        resourceName="expenses-v2"
        initialLimit={5}
        filters={filters}
        rowActions={rowActions}
        handlers={actionHandlers}
      />
    </div>
  );
}
