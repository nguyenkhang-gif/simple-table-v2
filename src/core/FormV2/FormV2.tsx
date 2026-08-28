import { useId, useMemo, useState } from 'react'
import { useForm, type FieldErrors } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Accordion } from '@/components/ui/accordion'
import { FormSection } from './components/FormSection'
import { buildDefaultValues } from './rules'
import type { FormSectionDecl, FormV2Props, FormValues } from './types'

/** Section nào đang mở lúc khởi tạo */
function initialOpenSections(sections: FormSectionDecl<FormValues>[]): string[] {
  return sections.filter((s) => s.defaultOpen !== false).map((s) => s.key)
}

// `object` chứ không phải `FormValues`: một `interface` không tự sinh index
// signature nên không thoả `Record<string, unknown>` (chỉ `type` alias mới thoả).
export function FormV2<T extends object = FormValues>({
  sections,
  defaultValues,
  onSubmit,
  onCancel,
  submitText = 'Submit',
  cancelText = 'Cancel',
  submitting = false,
  formId,
  hideFooter = false,
}: FormV2Props<T>) {
  const typedSections = sections as unknown as FormSectionDecl<FormValues>[]
  const generatedId = useId()
  const resolvedFormId = formId ?? generatedId

  const initialValues = useMemo(
    () => buildDefaultValues(sections, defaultValues),
    [sections, defaultValues],
  )

  const form = useForm<FormValues>({
    defaultValues: initialValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange', // sau lần submit đầu, lỗi tự mất khi sửa đúng
  })

  const [openSections, setOpenSections] = useState<string[]>(() =>
    initialOpenSections(typedSections),
  )

  const { errors } = form.formState

  // Đếm lỗi theo section để hiện badge trên header
  const errorCountBySection = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const section of typedSections) {
      counts[section.key] = section.fields.filter((f) => Boolean(errors[f.name])).length
    }
    return counts
  }, [typedSections, errors])

  /**
   * Lỗi nằm trong section đang đóng thì user không thấy gì — mở ra.
   * Chạy trong nhánh invalid của `handleSubmit`, tức là một event handler:
   * đúng nơi có nguyên nhân, và không phải setState trong effect (§8.2).
   */
  const openSectionsWithErrors = (fieldErrors: FieldErrors<FormValues>) => {
    const failed = new Set(Object.keys(fieldErrors))
    const keys = typedSections
      .filter((s) => s.fields.some((f) => failed.has(f.name)))
      .map((s) => s.key)

    setOpenSections((prev) => {
      const missing = keys.filter((key) => !prev.includes(key))
      return missing.length > 0 ? [...prev, ...missing] : prev
    })
  }

  return (
    <Form {...form}>
      <form
        id={resolvedFormId}
        onSubmit={form.handleSubmit(
          (values) => onSubmit(values as T),
          openSectionsWithErrors,
        )}
        className="space-y-4"
      >
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
          className="space-y-3"
        >
          {typedSections.map((section) => (
            <FormSection
              key={section.key}
              section={section}
              errorCount={errorCountBySection[section.key] ?? 0}
            />
          ))}
        </Accordion>

        {!hideFooter && (
          <div className="flex justify-end gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                {cancelText}
              </Button>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : submitText}
            </Button>
          </div>
        )}
      </form>
    </Form>
  )
}
