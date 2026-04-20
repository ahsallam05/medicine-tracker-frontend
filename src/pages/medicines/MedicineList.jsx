import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, AlertCircle, Pill } from 'lucide-react';
import medicineService from '../../api/services/medicineService';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import MedicineModal from '../../components/ui/MedicineModal';
import Spinner from '../../components/ui/Spinner';
import BadgeFactory from '../../utils/BadgeFactory';
import { CategoryDropdown } from '../../components/ui/FilterPanel';
import { useFilters } from '../../hooks/useFilters';

const LIMIT = 50;

function Pagination({ page, totalPages, total, canPrev, canNext, isLoading, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible range
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);

      // Adjust if at the beginning
      if (page <= 2) {
        end = Math.min(totalPages - 1, 4);
      }

      // Adjust if at the end
      if (page >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add visible pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
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
        className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
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
              className={`cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium ${
                pageNum === page
                  ? 'bg-white text-slate-900 ring-1 ring-black'
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
        className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Next
      </button>

      <div className="ml-4 text-sm text-slate-500">
        Total: {total}
      </div>
    </div>
  );
}

function formatDate(dateRaw) {
  if (!dateRaw) return '—';
  const d = new Date(dateRaw);
  if (Number.isNaN(d.getTime())) return String(dateRaw);
  return d.toLocaleDateString();
}

function normalizeListResponse(payload) {
  const source = payload ?? {};
  const medicines = Array.isArray(source.medicines) ? source.medicines : [];

  const currentPage = Number(source.pagination?.page ?? 1);
  const totalPages = Number(source.pagination?.pages ?? 1);
  const total = Number(source.pagination?.total ?? 0);

  return {
    medicines,
    page: Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1,
    totalPages:
      Number.isFinite(totalPages) && totalPages > 0 ? Math.floor(totalPages) : 1,
    total: Number.isFinite(total) && total >= 0 ? Math.floor(total) : 0,
  };
}

export default function MedicineList() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Use the filters hook
  const filterState = useFilters();
  const {
    category,
    setCategory,
    getApiParams,
  } = filterState;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalMedicine, setModalMedicine] = useState(undefined);

  const fetchMedicines = useCallback(async (currentPage, searchTerm) => {
    const params = {
      page: currentPage,
      limit: LIMIT,
      sortBy: 'created_at',
      order: 'desc',
    };
    const filterParams = getApiParams();
    Object.assign(params, filterParams);
    if (searchTerm?.trim()) params.search = searchTerm.trim();

    const res = await medicineService.getAll(params);
    const normalized = normalizeListResponse(res);
    setMedicines(normalized.medicines);
    setPagination({
      page: normalized.page,
      totalPages: normalized.totalPages,
      total: normalized.total,
    });
  }, [getApiParams]);



  useEffect(() => {
    let isMounted = true;

    async function loadMedicines() {
      setIsLoading(true);
      setError('');

      try {
        await fetchMedicines(page, search);
        if (!isMounted) return;
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.response?.data?.message || 'Failed to load medicines list.',
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMedicines();
    return () => {
      isMounted = false;
    };
  }, [fetchMedicines, page, search]);

  const confirmMessage = useMemo(() => {
    if (!deleteTarget) return '';
    return `Delete "${deleteTarget.name}"? This action cannot be undone.`;
  }, [deleteTarget]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await medicineService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchMedicines();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to delete the selected medicine.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const canPrev = page > 1;
  const canNext = page < pagination.totalPages;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold text-slate-800">Medicines</h1>
        <button
          type="button"
          onClick={() => setModalMedicine(null)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Medicine
        </button>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(event) => { setSearch(event.target.value); setPage(1); }}
          placeholder="Search by medicine name..."
          className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:flex-1"
        />
        <div className="h-10 w-full sm:w-48">
          <CategoryDropdown value={category} onChange={(value) => { setCategory(value); setPage(1); }} />
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Expiry Date</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8">
                    <Spinner />
                  </td>
                </tr>
              ) : medicines.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-12 text-center text-sm text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Pill className="h-8 w-8 text-slate-300" />
                      <span>No medicines found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                medicines.map((medicine) => {
                  const badge = BadgeFactory.create(medicine);
                  return (
                    <tr key={medicine.id}>
                      <td className="px-3 py-2 text-sm font-medium text-slate-800">
                        {medicine.name}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {medicine.category ?? '—'}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {medicine.quantity ?? 0}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {formatDate(medicine.expiry_date)}
                      </td>
                      <td className="px-3 py-2">
                        <Badge label={badge.label} color={badge.color} />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setModalMedicine(medicine)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-teal-600 px-2 py-1 text-xs font-medium text-white hover:bg-teal-700"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(medicine)}
                            className="inline-flex cursor-pointer items-center gap-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          canPrev={canPrev}
          canNext={canNext}
          isLoading={isLoading}
          onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete Medicine"
        message={confirmMessage}
        confirmText="Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => (isDeleting ? null : setDeleteTarget(null))}
      />

      {modalMedicine !== undefined ? (
        <MedicineModal
          isOpen
          onClose={() => setModalMedicine(undefined)}
          medicine={modalMedicine ?? null}
          onSaved={async () => {
            setError('');
            await fetchMedicines();
          }}
        />
      ) : null}

    </div>
  );
}
