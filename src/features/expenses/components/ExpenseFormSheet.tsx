import { useMemo, useState } from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FormV2 } from '@/core/FormV2/FormV2'
import type { FormSectionDecl } from '@/core/FormV2/types'
import { createExpenseApi, updateExpenseApi } from '../expensesApi'
import type { Expense, ExpenseCategory } from '../types'

/** Giá trị form — `amount` là số, `id` không nằm trong form */
interface ExpenseFormValues {
  note: string
  amount: number
  category: ExpenseCategory
  date: string
}

/** Nút submit nằm trong SheetFooter, ngoài <form> — nối lại bằng thuộc tính `form` */
const FORM_ID = 'expense-form'

export interface ExpenseFormSheetProps {
  /** Chế độ, khai rõ ở nơi gọi thay vì suy ngược từ việc `record` có hay không */
  isEdit?: boolean
  record?: Expense
  close: (shouldRefetch?: boolean) => void
}

export function ExpenseFormSheet({ isEdit = false, record, close }: ExpenseFormSheetProps) {
  const [submitting, setSubmitting] = useState(false)

  const sections = useMemo<FormSectionDecl<ExpenseFormValues>[]>(
    () => [
      {
        key: 'general',
        title: 'General',
        columns: 2,
        fields: [
          {
            name: 'note',
            label: 'Note',
            variant: 'text',
            placeholder: 'e.g. Coffee',
            colSpan: 2,
            rules: [
              { required: true, message: 'Note is required' },
              { min: 3, message: 'At least 3 characters' },
            ],
          },
          {
            name: 'amount',
            label: 'Amount',
            variant: 'number',
            placeholder: '50000',
            colSpan: 1,
            rules: [
              { required: true, message: 'Amount is required' },
              { min: 1000, message: 'Minimum 1,000đ' },
            ],
          },
          {
            name: 'date',
            label: 'Date',
            variant: 'date',
            colSpan: 1,
            defaultValue: new Date().toISOString().slice(0, 10),
            rules: [{ required: true }],
          },
        ],
      },
      {
        key: 'classification',
        title: 'Classification',
        columns: 1,
        fields: [
          {
            name: 'category',
            label: 'Category',
            variant: 'select',
            defaultValue: 'food',
            options: [
              { label: 'Food', value: 'food' },
              { label: 'Transport', value: 'transport' },
              { label: 'Shopping', value: 'shopping' },
              { label: 'Bills', value: 'bills' },
              { label: 'Entertainment', value: 'entertainment' },
            ],
            rules: [{ required: true, message: 'Pick a category' }],
          },
        ],
      },
    ],
    [],
  )

  const handleSubmit = async (values: ExpenseFormValues) => {
    setSubmitting(true)
    // `&& record` là lưới an toàn, không phải cách xác định chế độ: kiểu không
    // ràng được `isEdit` đi kèm `record`, mà gọi PUT thiếu id thì hỏng dữ liệu
    const result =
      isEdit && record ? await updateExpenseApi(record.id, values) : await createExpenseApi(values)
    setSubmitting(false)

    if (result) close(true)
  }

  return (
    <Sheet open onOpenChange={(open) => !open && close(false)} >
      {/*
        Phải khai kèm `data-[side=right]:` cho khớp modifier của class gốc trong
        `sheet.tsx`. Viết trần (`w-full`, `sm:max-w-lg`) thì tailwind-merge coi
        là key khác nên giữ cả hai, rồi class gốc thắng vì có thêm attribute
        selector (`…[data-side=right]`) — độ đặc hiệu cao hơn.
      */}
      <SheetContent className="flex flex-col data-[side=right]:w-full data-[side=right]:sm:max-w-lg gap-0 ">
        {/* `truncate` giữ header cao cố định khi note dài */}
        <SheetHeader className="gap-0 border-b px-4 py-2">
          <SheetTitle className="text-sm">{isEdit ? 'Edit expense' : 'New expense'}</SheetTitle>
          <SheetDescription className="truncate text-xs">
            {isEdit ? `Editing "${record?.note}"` : 'Add a new expense record.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          <FormV2<ExpenseFormValues>
            formId={FORM_ID}
            hideFooter
            sections={sections}
            defaultValues={record}
            onSubmit={handleSubmit}
          />
        </div>

        <SheetFooter className="border-t">
          <Button type="submit" form={FORM_ID} disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create'}
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
