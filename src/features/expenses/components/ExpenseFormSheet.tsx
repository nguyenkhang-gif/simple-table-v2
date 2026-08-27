import { useState, type FormEvent } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExpenseApi, updateExpenseApi } from "../expensesApi";
import type { Expense, ExpenseCategory } from "../types";

const CATEGORY_OPTIONS: ExpenseCategory[] = [
  "food",
  "transport",
  "shopping",
  "bills",
  "entertainment",
];

export interface ExpenseFormSheetProps {
  /** Có record là sửa, không có là tạo mới */
  record?: Expense;
  close: (shouldRefetch?: boolean) => void;
}

export function ExpenseFormSheet({ record, close }: ExpenseFormSheetProps) {
  const isEdit = Boolean(record);

  const [note, setNote] = useState(record?.note ?? "");
  const [amount, setAmount] = useState(record ? String(record.amount) : "");
  const [category, setCategory] = useState<ExpenseCategory>(record?.category ?? "food");
  const [date, setDate] = useState(record?.date ?? new Date().toISOString().slice(0, 10));
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!note || !amount) return;

    setSubmitting(true);
    const payload = { note, amount: Number(amount), category, date };
    const result = record
      ? await updateExpenseApi(record.id, payload)
      : await createExpenseApi(payload);
    setSubmitting(false);

    if (result) close(true);
  };

  return (
    <Sheet open onOpenChange={(open) => !open && close(false)}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit expense" : "New expense"}</SheetTitle>
          <SheetDescription>
            {isEdit ? `Editing "${record?.note}"` : "Add a new expense record."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 px-4">
          <div className="grid gap-2">
            <Label htmlFor="expense-note">Note</Label>
            <Input
              id="expense-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Coffee"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expense-amount">Amount</Label>
            <Input
              id="expense-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expense-category">Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ExpenseCategory)}
            >
              <SelectTrigger id="expense-category" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expense-date">Date</Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <SheetFooter className="mt-auto px-0">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Create"}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
