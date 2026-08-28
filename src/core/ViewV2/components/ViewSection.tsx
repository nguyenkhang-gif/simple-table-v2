import { cn } from '@/lib/utils'
import { GRID_COLS } from '@/lib/grid'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ViewField } from './ViewField'
import type { ViewSectionDecl } from '../types'

export interface ViewSectionProps<T> {
  section: ViewSectionDecl<T>
  record: T
}

export function ViewSection<T>({ section, record }: ViewSectionProps<T>) {
  const columns = section.columns ?? 2
  const visibleFields = section.fields.filter((field) => !field.hidden?.(record))

  return (
    <AccordionItem value={section.key} className="rounded-md border last:border-b">
      <AccordionTrigger className="rounded-t-md bg-muted/50 px-4 hover:no-underline">
        <div className="text-left">
          <div className="font-medium">{section.title}</div>
          {section.description && (
            <div className="text-sm font-normal text-muted-foreground">
              {section.description}
            </div>
          )}
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-4">
        <div className={cn('grid gap-4', GRID_COLS[columns])}>
          {visibleFields.map((field, index) => (
            <ViewField key={`${field.name}-${index}`} field={field} record={record} />
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
