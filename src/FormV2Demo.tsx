import { useMemo, useState } from 'react'
import { FormV2 } from './FormV2/FormV2'
import type { FormSectionDecl } from './FormV2/types'

interface ExpenseForm {
  note: string
  amount: number
  date: string
  category: string
  dish: string
  description: string
  receiptCode: string
}

export function FormV2Demo() {
  const [submitted, setSubmitted] = useState<ExpenseForm | null>(null)

  const sections = useMemo<FormSectionDecl<ExpenseForm>[]>(
    () => [
      // ── Part 1: A, B, C ── lưới 2 cột
      {
        key: 'general',
        title: 'General',
        description: 'Basic expense information',
        columns: 2,
        defaultOpen: true,
        fields: [
          {
            name: 'note', // A — chiếm trọn hàng
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
            name: 'amount', // B ─┐ hai field này
            label: 'Amount',
            variant: 'number',
            placeholder: '50000',
            colSpan: 1, //     │ nằm chung một hàng
            rules: [
              { required: true, message: 'Amount is required' },
              { min: 1000, message: 'Minimum 1,000đ' },
            ],
          },
          {
            name: 'date', // C ─┘
            label: 'Date',
            variant: 'date',
            colSpan: 1,
            defaultValue: new Date().toISOString().slice(0, 10),
            rules: [{ required: true }],
          },
        ],
      },

      // ── Part 2: D, E ── lưới 6 cột để chia tỉ lệ kiểu flex-grow
      {
        key: 'classification',
        title: 'Classification',
        columns: 6,
        fields: [
          {
            name: 'category', // D — rộng gấp đôi
            label: 'Category',
            variant: 'select',
            colSpan: 4,
            options: [
              { label: 'Food', value: 'food' },
              { label: 'Transport', value: 'transport' },
              { label: 'Shopping', value: 'shopping' },
            ],
            rules: [{ required: true, message: 'Pick a category' }],
          },
          {
            name: 'dish', // E — chỉ hiện khi chọn Food
            label: 'Dish',
            variant: 'text',
            placeholder: 'e.g. Beef noodles',
            colSpan: 2,
            hidden: (values) => values.category !== 'food',
            rules: [{ required: true, message: 'Dish is required for food' }],
          },
        ],
      },

      // ── Part 3: F, G ── mặc định đóng
      {
        key: 'extra',
        title: 'Additional details',
        description: 'Optional — collapsed by default',
        columns: 1,
        defaultOpen: false,
        fields: [
          {
            name: 'description', // F
            label: 'Description',
            variant: 'textarea',
            placeholder: 'Optional notes...',
            rules: [{ max: 500, message: 'Max 500 characters' }],
          },
          {
            name: 'receiptCode', // G — có rule pattern, để trống vẫn qua
            label: 'Receipt code',
            variant: 'text',
            placeholder: 'RC-123456',
            description: 'Format: RC- followed by 6 digits',
            rules: [{ pattern: /^RC-\d{6}$/, message: 'Format: RC-123456' }],
          },
        ],
      },
    ],
    [],
  )

  return (
    <div className="mx-auto max-w-3xl p-8 font-sans">
      <h1 className="mb-4 text-xl font-semibold">FormV2 — section demo</h1>

      <FormV2<ExpenseForm>
        sections={sections}
        submitText="Create expense"
        onCancel={() => setSubmitted(null)}
        onSubmit={(values) => {
          console.log('FormV2 submit:', values)
          setSubmitted(values)
        }}
      />

      {submitted && (
        <pre className="mt-6 overflow-x-auto rounded-md border bg-muted/50 p-4 text-xs">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  )
}
