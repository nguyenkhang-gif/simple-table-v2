import { useFormContext, useWatch } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { FieldRenderer } from './FieldRenderer'
import { toRhfRules } from '../rules'
import { COL_SPAN, GRID_COLS } from '@/lib/grid'
import type { FormSectionDecl, FormValues } from '../types'

export interface FormSectionProps {
  section: FormSectionDecl<FormValues>
  errorCount: number
}

export function FormSection({ section, errorCount }: FormSectionProps) {
  const { control, getValues } = useFormContext()
  // Chỉ section này re-render theo giá trị, không kéo cả form
  const values = useWatch({ control }) as FormValues

  const columns = section.columns ?? 2
  const visibleFields = section.fields.filter((field) => !field.hidden?.(values))

  return (
    <AccordionItem value={section.key} className="rounded-md border last:border-b">
      <AccordionTrigger className="rounded-t-md bg-muted/50 px-4 hover:no-underline">
        <div className="flex flex-1 items-center justify-between gap-2 pr-2">
          <div className="text-left">
            <div className="font-medium">{section.title}</div>
            {section.description && (
              <div className="text-sm font-normal text-muted-foreground">
                {section.description}
              </div>
            )}
          </div>
          {errorCount > 0 && (
            <span className="rounded-full bg-destructive px-2 py-0.5 text-xs text-white">
              {errorCount}
            </span>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4 h-auto">
        <div className={cn('grid gap-4', GRID_COLS[columns])}>
          {visibleFields.map((field) => {
            const isRequired = field.rules?.some((rule) => rule.required)

            return (
              <FormField
                key={field.name}
                control={control}
                name={field.name}
                rules={toRhfRules(field.rules, field.variant, () => getValues())}
                render={({ field: rhfField }) => (
                  <FormItem className={COL_SPAN[field.colSpan ?? 1]}>
                    <FormLabel>
                      {field.label}
                      {isRequired && <span className="text-destructive">*</span>}
                    </FormLabel>
                    <FormControl>
                      <FieldRenderer
                        field={field}
                        value={rhfField.value}
                        onChange={rhfField.onChange}
                        onBlur={rhfField.onBlur}
                      />
                    </FormControl>
                    {field.description && <FormDescription>{field.description}</FormDescription>}
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          })}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
