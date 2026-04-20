import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, AlertCircle, Pill } from 'lucide-react';
import medicineService from '../../api/services/medicineService';
import Badge from '../../components/ui/Badge';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import MedicineModal from '../../components/ui/MedicineModal';
import Spinner from '../../components/ui/Spinner';
import BadgeFactory from '../../utils/BadgeFactory';

const LIMIT = 20;

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
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalMedicine, setModalMedicine] = useState(undefined);

  const fetchMedicines = useCallback(async () => {
    const params = {
      page,
      limit: LIMIT,
      sortBy: 'created_at',
      order: 'desc',
    };
    if (debouncedSearch) params.search = debouncedSearch;
    if (category !== 'All') params.category = category;

    const res = await medicineService.getAll(params);
    const normalized = normalizeListResponse(res);
    setMedicines(normalized.medicines);
    setPage(normalized.page);
    setTotalPages(normalized.totalPages);
    setTotal(normalized.total);
  }, [page, debouncedSearch, category]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let isMounted = true;

    async function loadMedicines() {
      setIsLoading(true);
      setError('');

      try {
        await fetchMedicines();
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
  }, [fetchMedicines]);

  const canPrev = page > 1;
  const canNext = page < totalPages;

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

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px]">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search medicines..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        />
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            setPage(1);
          }}
          className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
        >
          <option value="All">All</option>
          <option value="Antipyretics">Antipyretics</option>
          <option value="Antibiotics">Antibiotics</option>
          <option value="Antidiabetics">Antidiabetics</option>
          <option value="Cardiovascular">Cardiovascular</option>
          <option value="Respiratory">Respiratory</option>
          <option value="Gastrointestinal">Gastrointestinal</option>
          <option value="Neurological">Neurological</option>
          <option value="Supplements">Supplements</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Ophthalmology">Ophthalmology</option>
          <option value="Endocrinology">Endocrinology</option>
          <option value="Antivirals">Antivirals</option>
          <option value="Urology">Urology</option>
        </select>
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
                    <tr key={medicine.id ?? `${medicine.name}-${medicine.expiry_date}`}>
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

        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev || isLoading}
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <div className="text-center">
            <div className="text-sm text-slate-700">
              Page {page} of {totalPages}
            </div>
            <div className="mt-1 text-xs text-slate-500">Total results: {total}</div>
          </div>
          <button
            type="button"
            onClick={() => setPage((p) => (canNext ? p + 1 : p))}
            disabled={!canNext || isLoading}
            className="cursor-pointer rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
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
