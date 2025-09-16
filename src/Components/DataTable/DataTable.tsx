import React, { useEffect, useMemo, useState } from 'react';
import { cn } from '../../libs/utils';

export type Column<T> = {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
};

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  selectionMode?: 'single' | 'multiple'; // default: multiple
  onRowSelect?: (selectedRows: T[]) => void;
  itemsPerPage?: number;
  emptyState?: React.ReactNode;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  loading = false,
  selectable = false,
  selectionMode = 'multiple',
  onRowSelect,
  itemsPerPage = 10,
  emptyState,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<T['id']>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // reset page if data length changes (keeps pagination safe)
    setCurrentPage(1);
  }, [data.length]);

  const compare = (a: unknown, b: unknown): number => {
    if (a == null && b == null) return 0;
    if (a == null) return -1;
    if (b == null) return 1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    const sa = String(a);
    const sb = String(b);
    return sa.localeCompare(sb, undefined, { numeric: true, sensitivity: 'base' });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig) return [...data];
    const s = [...data].sort((x, y) => {
      const a = x[sortConfig.key];
      const b = y[sortConfig.key];
      const cmp = compare(a, b);
      return sortConfig.direction === 'asc' ? cmp : -cmp;
    });
    return s;
  }, [data, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const handleSort = (key: keyof T, sortable?: boolean) => {
    if (!sortable) return;
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const notifySelection = (ids: Set<T['id']>) => {
    const arr = data.filter((d) => ids.has(d.id));
    onRowSelect?.(arr);
  };

  const handleSelectRow = (row: T) => {
    if (!selectable) return;
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (selectionMode === 'single') {
        if (next.has(row.id)) next.clear();
        else {
          next.clear();
          next.add(row.id);
        }
      } else {
        if (next.has(row.id)) next.delete(row.id);
        else next.add(row.id);
      }
      notifySelection(next);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (!selectable || selectionMode === 'single') return;
    setSelectedRows((prev) => {
      if (prev.size === data.length) {
        notifySelection(new Set());
        return new Set();
      }
      const all = new Set(data.map((r) => r.id));
      notifySelection(all);
      return all;
    });
  };

  const goToNext = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const goToPrev = () => setCurrentPage((p) => Math.max(1, p - 1));

  if (loading) {
    // skeleton table while loading
    return (
      <div className="w-full space-y-3">
        <div className="rounded-lg border overflow-hidden">
          <div className="p-4">
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              {Array.from({ length: Math.min(5, itemsPerPage) }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  {selectable && <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />}
                  <div className="h-8 flex-1 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        {emptyState ?? (
          <div className="flex flex-col items-center gap-3">
            <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 3H8v4h8V3z" />
            </svg>
            <div>No data available.</div>
            <div className="text-xs text-gray-600">Try changing filters or check back later.</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && selectionMode === 'multiple' && (
                <th className="px-4 py-3 text-left w-12">
                  <label className="sr-only">Select all</label>
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    onChange={handleSelectAll}
                    checked={selectedRows.size === data.length && data.length > 0}
                    className="h-4 w-4"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortConfig?.key === col.dataIndex;
                return (
                  <th
                    key={col.key}
                    className={cn(
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none",
                      col.width && `datatable-col-width-${col.key}`
                    )}
                  >
                    <div
                      tabIndex={col.sortable ? 0 : undefined}
                      onClick={() => handleSort(col.dataIndex as keyof T, col.sortable)}
                      onKeyDown={(e) => {
                        if (col.sortable && (e.key === 'Enter' || e.key === ' ')) handleSort(col.dataIndex as keyof T, col.sortable);
                      }}
                      className={cn('flex items-center gap-2', col.sortable && 'cursor-pointer')}
                    >
                      <span>{col.title}</span>
                      {col.sortable && (
                        <span className="flex flex-col">
                          <svg className={cn('h-3 w-3', isSorted && sortConfig?.direction === 'asc' ? 'text-blue-600' : 'text-gray-300')} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <svg className={cn('h-3 w-3 -mt-1', isSorted && sortConfig?.direction === 'desc' ? 'text-blue-600' : 'text-gray-300')} viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row) => {
              const selected = selectedRows.has(row.id);
              return (
                <tr key={row.id} className={cn('hover:bg-gray-50', selected && 'bg-blue-50')}>
                  {selectable && (
                    <td className="px-4 py-3 align-top w-12">
                      {selectionMode === 'single' ? (
                        <input
                          type="radio"
                          name="datatable-single-select"
                          aria-label={`Select row ${row.id}`}
                          checked={selected}
                          onChange={() => handleSelectRow(row)}
                          className="h-4 w-4"
                          disabled={loading}
                        />
                      ) : (
                        <input
                          type="checkbox"
                          aria-label={`Select row ${row.id}`}
                          checked={selected}
                          onChange={() => handleSelectRow(row)}
                          className="h-4 w-4"
                          disabled={loading}
                        />
                      )}
                    </td>
                  )}

                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {col.render ? col.render(row[col.dataIndex], row) : String(row[col.dataIndex] ?? '')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button onClick={goToPrev} disabled={currentPage === 1} className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50">
            Previous
          </button>
          <div className="text-sm text-gray-600">Page {currentPage} of {totalPages}</div>
          <button onClick={goToNext} disabled={currentPage === totalPages} className="px-3 py-2 text-sm border rounded-md hover:bg-gray-50 disabled:opacity-50">
            Next
          </button>
        </div>
      )}
    </div>
  );
}

