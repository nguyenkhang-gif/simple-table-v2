import { useMemo, useState } from 'react'
import { Pencil } from 'lucide-react'
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
import { ViewV2 } from '@/core/ViewV2/ViewV2'
import { formatCurrency } from '@/core/ViewV2/formatters'
import type { ViewSectionDecl } from '@/core/ViewV2/types'

interface ExpenseDetail {
  id: string
  note: string
  amount: number
  quantity: number
  date: string
  category: string
  dish: string
  reimbursed: boolean
  receiptCode: string
}

const RECORD: ExpenseDetail = {
  id: 'exp_42',
  note: 'Office lunch',
  amount: 185000,
  quantity: 3,
  date: '2026-08-12',
  category: 'food',
  dish: 'Beef noodles',
  reimbursed: true,
  receiptCode: '', // để trống để thấy fallback "—"
}

const CATEGORY_COLORS: Record<string, string> = {
  food: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  transport: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  shopping: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
}

export function ViewV2Demo() {
  const [open, setOpen] = useState(true)

  const sections = useMemo<ViewSectionDecl<ExpenseDetail>[]>(
    () => [
      {
        key: 'general',
        title: 'General',
        description: 'Basic expense information',
        columns: 2,
        fields: [
          { name: 'note', label: 'Note', colSpan: 2 },
          { name: 'amount', label: 'Unit amount', format: 'currency' },
          { name: 'quantity', label: 'Quantity' },
          { name: 'date', label: 'Date', format: 'date' },
          {
            // Giá trị tính toán — dùng lại formatCurrency thay vì tự định dạng
            name: 'amount',
            label: 'Total',
            format: 'component',
            render: ({ record }) => (
              <span className="font-medium">
                {formatCurrency(record.amount * record.quantity)}
              </span>
            ),
          },
        ],
      },
      {
        key: 'classification',
        title: 'Classification',
        columns: 2,
        fields: [
          {
            name: 'category',
            label: 'Category',
            format: 'badge',
            badgeColors: CATEGORY_COLORS,
          },
          {
            name: 'dish',
            label: 'Dish',
            hidden: (record) => record.category !== 'food',
          },
          { name: 'reimbursed', label: 'Reimbursed', format: 'boolean' },
          { name: 'receiptCode', label: 'Receipt code' },
        ],
      },
      {
        key: 'meta',
        title: 'Metadata',
        columns: 1,
        defaultOpen: false,
        fields: [
          {
            name: 'id',
            label: 'Reference',
            format: 'component',
            render: ({ record }) => (
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {record.id} · {record.category}
              </code>
            ),
          },
        ],
      },
    ],
    [],
  )

  return (
    <div className="mx-auto max-w-3xl p-8 font-sans">
      <h1 className="mb-4 text-xl font-semibold">ViewV2 — record detail demo</h1>
      <Button onClick={() => setOpen(true)}>Open detail</Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="flex flex-col data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Expense detail</SheetTitle>
            <SheetDescription>Read-only view of "{RECORD.note}"</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <ViewV2 sections={sections} record={RECORD} />
          </div>

          {/* Footer hoàn toàn của màn hình — ViewV2 không biết gì về nó */}
          <SheetFooter className="border-t">
            <Button onClick={() => alert('Chuyển sang màn sửa')}>
              <Pencil className="size-4" />
              Edit
            </Button>
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
