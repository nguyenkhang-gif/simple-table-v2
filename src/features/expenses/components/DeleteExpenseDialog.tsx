import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteExpenseApi } from "../expensesApi";
import type { Expense } from "../types";

export interface DeleteExpenseDialogProps {
  record: Expense | undefined;
  close: (shouldRefetch?: boolean) => void;
}

export function DeleteExpenseDialog({ record, close }: DeleteExpenseDialogProps) {
  return (
    <AlertDialog open onOpenChange={(open) => !open && close(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá chi tiêu?</AlertDialogTitle>
          <AlertDialogDescription>
            "{record?.note}" — {record?.amount.toLocaleString()}đ. Hành động này không thể hoàn
            tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteExpenseApi(record!.id);
              close(true);
            }}
          >
            Xoá
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
