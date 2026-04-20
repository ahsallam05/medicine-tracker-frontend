import React from 'react';
import Spinner from './Spinner';

/**
 * Generic DataTable component.
 * Handles headers, empty states, and loading states.
 */
export default function DataTable({
  columns,
  data = [],
  isLoading = false,
  emptyMessage = 'No data found',
  emptyIcon: EmptyIcon,
  rowKey = 'id',
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2">
        <thead>
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            {columns.map((col) => (
              <th key={col.key} className={`px-3 py-2 ${col.className || ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-12">
                <Spinner />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 py-16 text-center text-sm text-slate-500"
              >
                <div className="flex flex-col items-center gap-2">
                  {EmptyIcon && <EmptyIcon className="h-10 w-10 text-slate-300" />}
                  <span>{emptyMessage}</span>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[rowKey]} className="group hover:bg-slate-50/50 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-3 py-3 text-sm text-slate-700 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
