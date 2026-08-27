import { useEffect } from 'react'
import { pick } from 'lodash'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { useListController } from './useListController'
import { defaultCellValue } from './utils'
import type { ColumnDef, DataTableV2Props } from './types'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { FilterBar } from './components/FilterBar'

export function DataTableV2<T extends { id: string }, A extends string = never>(
  props: DataTableV2Props<T, A>,
) {
  const {
    columns,
    emptyMessage = 'No data',
    renderLoading,
    renderError,
    renderEmpty,
    actions,
    rowActions,
    handlers,
    filters,
    fetch,
    resourceName,
    initialLimit = 10,
    externalParams,
  } = pick(props, [
    'columns',
    'emptyMessage',
    'renderLoading',
    'renderError',
    'renderEmpty',
    'actions',
    'rowActions',
    'handlers',
    'filters',
    'fetch',
    'resourceName',
    'initialLimit',
    'externalParams',
  ])

  const ctrl = useListController<T, A>({
    columns,
    fetch,
    resourceName,
    filters,
    initialLimit,
    externalParams,
  })

  const hasRowActions = Boolean(rowActions && rowActions.length > 0)
  const columnCount = columns.length + (hasRowActions ? 1 : 0)

  // asc -> desc -> none, đúng nguồn sự thật duy nhất (§5) — cha không tự set sorting
  const toggleSort = (col: ColumnDef<T>) => {
    if (!col.sortable) return
    if (ctrl.sorting?.key !== col.key) {
      ctrl.updateSorting({ key: col.key, direction: 'asc' })
    } else if (ctrl.sorting.direction === 'asc') {
      ctrl.updateSorting({ key: col.key, direction: 'desc' })
    } else {
      ctrl.updateSorting(undefined)
    }
  }

  const activeHandler = ctrl.activeAction
    ? handlers?.find(
        (h) =>
          h.name === ctrl.activeAction!.status ||
          (Array.isArray(h.name) && h.name.includes(ctrl.activeAction!.status)),
      )
    : undefined

  const actionContext = ctrl.activeAction
    ? {
        record: ctrl.activeAction.record,
        selectedRows: [], // tạm thời để mảng rỗng — nối selectedIds sau
        queryParams: ctrl.queryParams,
        refetch: ctrl.refetch,
        close: ctrl.closeAction,
        status: ctrl.activeAction.status,
      }
    : undefined

  // Side effect (thường là gọi API) phải chạy trong useEffect, không chạy
  // trực tiếp trong thân render — tránh bị gọi lại khi StrictMode render 2 lần
  // hoặc khi component re-render vì lý do không liên quan (§8.2).
  useEffect(() => {
    if (activeHandler?.run && actionContext) {
      activeHandler.run(actionContext)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrl.activeAction])

  if (ctrl.isLoading) {
    return renderLoading ? (
      <>{renderLoading()}</>
    ) : (
      <div className="p-4 text-center text-muted-foreground">Loading...</div>
    )
  }

  if (ctrl.error) {
    return renderError ? (
      <>{renderError(ctrl.error, ctrl.refetch)}</>
    ) : (
      <div className="p-4 text-center text-destructive">
        Error: {String(ctrl.error)}{' '}
        <Button variant="link" className="h-auto p-0" onClick={() => ctrl.refetch()}>
          Retry
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      {actions && actions.length > 0 && (
        <div className="mb-2 flex gap-2">
          {actions.map((action) => (
            <Button key={action.type} size="sm" onClick={() => ctrl.openAction(action.type)}>
              {action.label ?? action.type}
            </Button>
          ))}
        </div>
      )}

      <FilterBar
        filters={filters}
        filterValues={ctrl.filterValues}
        initialFilterValues={ctrl.initialFilterValues}
        onFilterChange={ctrl.updateFilterValue}
        onClear={ctrl.clearFilters}
      />

      <div style={{ opacity: ctrl.isFetching ? 0.5 : 1 }}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.sortable ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => toggleSort(col)}
                          className="flex items-center gap-1 hover:text-foreground"
                        >
                          {col.label}
                          {ctrl.sorting?.key === col.key ? (
                            ctrl.sorting.direction === 'asc' ? (
                              <ArrowUp className="size-3.5" />
                            ) : (
                              <ArrowDown className="size-3.5" />
                            )
                          ) : (
                            <ArrowUpDown className="size-3.5 text-muted-foreground/50" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        Sort ({col.sortable === 'server' ? 'server-side' : 'client-side'})
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {hasRowActions && <TableHead />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ctrl.rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnCount} className="text-center text-muted-foreground">
                  {renderEmpty ? renderEmpty(emptyMessage) : emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              ctrl.rows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.render
                        ? col.render({ row, value: row[col.key] })
                        : defaultCellValue(row, col)}
                    </TableCell>
                  ))}
                  {hasRowActions && (
                    <TableCell>
                      <div className="flex gap-1">
                        {rowActions!.map((action) => {
                          if (action.render) {
                            return (
                              <span key={action.type}>
                                {action.render({
                                  openAction: () => ctrl.openAction(action.type, row),
                                })}
                              </span>
                            )
                          }

                          const button = (
                            <Button
                              variant="ghost"
                              size={action.icon ? 'icon-sm' : 'sm'}
                              onClick={() => ctrl.openAction(action.type, row)}
                            >
                              {action.icon ?? action.label ?? action.type}
                            </Button>
                          )

                          return action.icon ? (
                            <Tooltip key={action.type}>
                              <TooltipTrigger asChild>{button}</TooltipTrigger>
                              <TooltipContent>{action.label ?? action.type}</TooltipContent>
                            </Tooltip>
                          ) : (
                            <span key={action.type}>{button}</span>
                          )
                        })}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {activeHandler?.render && actionContext && <>{activeHandler.render(actionContext)}</>}

      {ctrl.meta && (
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={ctrl.page <= 1}
            onClick={() => ctrl.setPage((p) => p - 1)}
          >
            ← Prev
          </Button>
          <span className="text-muted-foreground">
            Page {ctrl.meta.page}/{ctrl.meta.totalPages} — {ctrl.meta.total} records total
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={ctrl.page >= ctrl.meta.totalPages}
            onClick={() => ctrl.setPage((p) => p + 1)}
          >
            Next →
          </Button>
        </div>
      )}
    </TooltipProvider>
  )
}
