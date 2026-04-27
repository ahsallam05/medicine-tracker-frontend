import { useCallback, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, AlertCircle, Pill } from 'lucide-react';
import { medicineService } from '../api';
import { Badge, ConfirmDialog, DataTable, Pagination } from '../components/ui';
import { MedicineModal, MedicineFilters } from '../components/medicines';
import { useFilters, useApi } from '../hooks';
import { BadgeFactory, formatDate } from '../utils';
import { MEDICINES_PER_PAGE } from '../constants';

const columns = [
  { key: 'name', label: 'Name', className: 'font-bold text-slate-800' },
  { key: 'category', label: 'Category', className: 'text-slate-500 font-medium' },
  { key: 'quantity', label: 'Quantity', className: 'font-semibold text-slate-700' },
  { key: 'expiry_date', label: 'Expiry Date', render: (row) => formatDate(row.expiry_date) },
  { 
    key: 'status', label: 'Status', 
    render: (row) => {
      const badge = BadgeFactory.create(row);
      return <Badge label={badge.label} color={badge.color} />;
    }
  },
];

export default function Medicines() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { category, setCategory, getApiParams } = useFilters();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalMedicine, setModalMedicine] = useState(undefined);

  const fetchMedicinesFn = useCallback(async (p, s) => {
    const params = { page: p, limit: MEDICINES_PER_PAGE, sortBy: 'created_at', order: 'desc', ...getApiParams() };
    if (s?.trim()) params.search = s.trim();
    return medicineService.getAll(params);
  }, [getApiParams]);

  const {
    data: listData, isLoading, error, setError, execute: fetchMedicines,
  } = useApi(fetchMedicinesFn, {
    initialData: { medicines: [], page: 1, totalPages: 1, total: 0 },
  });

  useEffect(() => {
    fetchMedicines(page, search);
  }, [page, search, getApiParams, fetchMedicines]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await medicineService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchMedicines(page, search);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columnsWithActions = [
    ...columns,
    {
      key: 'actions', label: 'Actions', className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button" onClick={() => setModalMedicine(row)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-100 transition-all active:scale-95"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button" onClick={() => setDeleteTarget(row)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-all active:scale-95"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Medicines</h1>
        <button
          type="button" onClick={() => setModalMedicine(null)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-all hover:bg-teal-700 active:scale-95"
        >
          <Plus className="h-5 w-5" /> Add Medicine
        </button>
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text" value={search}
            onChange={(event) => { setSearch(event.target.value); setPage(1); }}
            placeholder="Search medicine name..."
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 shadow-sm outline-none transition-all focus:border-teal-500 focus:ring-4 focus:ring-teal-50 placeholder:text-slate-400"
          />
        </div>
        <div className="h-12 w-full sm:w-56">
          <MedicineFilters value={category} onChange={(value) => { setCategory(value); setPage(1); }} />
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      ) : null}

      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
        <DataTable
          columns={columnsWithActions} data={listData.medicines} isLoading={isLoading}
          emptyMessage="No medicines found in inventory" emptyIcon={Pill} rowKey="id"
        />
        <Pagination
          page={listData.page} totalPages={listData.totalPages} total={listData.total}
          canPrev={listData.page > 1} canNext={listData.page < listData.totalPages}
          isLoading={isLoading} onPageChange={setPage}
        />
      </div>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)} title="Delete Medicine"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : ''}
        confirmText="Delete" loadingText="Deleting..." isLoading={isDeleting} onConfirm={handleDeleteConfirm}
        onCancel={() => (isDeleting ? null : setDeleteTarget(null))}
      />

      {modalMedicine !== undefined ? (
        <MedicineModal
          key={modalMedicine?.id || 'new'}
          isOpen onClose={() => setModalMedicine(undefined)}
          medicine={modalMedicine ?? null}
          onSaved={async () => { setError(''); await fetchMedicines(page, search); }}
        />
      ) : null}
    </div>
  );
}
