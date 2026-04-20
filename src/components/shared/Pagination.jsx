import React from 'react';

/**
 * Reusable Pagination component.
 */
export default function Pagination({
  page,
  totalPages,
  total,
  canPrev,
  canNext,
  isLoading,
  onPageChange,
}) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      if (page <= 2) {
        end = Math.min(totalPages - 1, 4);
      }
      if (page >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }
      if (start > 2) {
        pages.push('...');
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 1) {
        pages.push('...');
      }
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-gray-200 pt-3">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev || isLoading}
        className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
      >
        Previous
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-sm text-slate-500">
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              type="button"
              onClick={() => onPageChange(pageNum)}
              disabled={isLoading}
              className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                pageNum === page
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-700 hover:bg-gray-50'
              } disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext || isLoading}
        className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
      >
        Next
      </button>

      <div className="ml-4 text-sm text-slate-500 hidden sm:block">
        Total Items: <span className="font-semibold text-slate-700">{total}</span>
      </div>
    </div>
  );
}
