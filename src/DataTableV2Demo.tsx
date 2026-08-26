import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import { DataTableV2 } from "./DataTableV2/DataTableV2";
import type { ActionDecl, ActionImpl, ColumnDef } from "./DataTableV2/types";
import { getAllExpensesApi } from "./features/expenses/expensesApi";
import type { Expense } from "./features/expenses/types";
import { DeleteExpenseDialog } from "./features/expenses/components/DeleteExpenseDialog";

type ExpenseAction = "DELETE";

export function DataTableV2Demo() {
  const columns = useMemo<ColumnDef<Expense>[]>(
    () => [
      { key: "id", label: "ID" },
      { key: "category", label: "Danh mục" },
      { key: "note", label: "Ghi chú", filterable: "server" },
      {
        key: "amount",
        label: "Số tiền",
        sortable: "client",
        render: ({ value }) => `${(value as number).toLocaleString()}đ`,
      },
      { key: "date", label: "Ngày", sortable: "server" },
    ],
    [],
  );

  const rowActions = useMemo<ActionDecl<ExpenseAction>[]>(
    () => [{ type: "DELETE", label: "Xoá", icon: <Trash2 className="size-4" /> }],
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
    <div className="mx-auto max-w-3xl p-8 font-sans">
      <h1 className="mb-4 text-xl font-semibold">DataTableV2 — demo với expenses</h1>
      <DataTableV2
        columns={columns}
        fetch={(params) => getAllExpensesApi({ params })}
        resourceName="expenses-v2"
        initialLimit={5}
        rowActions={rowActions}
        handlers={actionHandlers}
      />
    </div>
  );
}
