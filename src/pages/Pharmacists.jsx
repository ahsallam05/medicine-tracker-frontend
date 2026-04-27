import { useState } from 'react';
import { Plus, Pencil, Trash2, Power, PowerOff, AlertCircle, Users } from 'lucide-react';
import { adminService } from '../api';
import { PharmacistModal } from '../components/admin';
import { ConfirmDialog, DataTable } from '../components/ui';
import { useApi } from '../hooks';

export default function Pharmacists() {
  const [modalPharmacist, setModalPharmacist] = useState(undefined);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: pharmacists, isLoading, error, setError, execute: fetchPharmacists,
  } = useApi(adminService.getAll, { 
    immediate: true, 
    initialData: [],
    transform: (data) => [...(data || [])].sort((a, b) => 
      new Date(b.updated_at || b.created_at || 0) - new Date(a.updated_at || a.created_at || 0)
    )
  });

  const handleToggleStatus = async (pharmacist) => {
    try {
      await adminService.updateStatus(pharmacist.id, !pharmacist.is_active);
      await fetchPharmacists();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await adminService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchPharmacists();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete.');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', className: 'font-bold text-slate-800' },
    { key: 'username', label: 'Username', className: 'text-slate-500 font-medium' },
    { 
      key: 'status', label: 'Status', 
      render: (p) => (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {p.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions', label: 'Actions', className: 'text-right',
      render: (p) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setModalPharmacist(p)}
            className="inline-flex cursor-pointer items-center rounded-xl bg-teal-50 p-2 text-teal-600 hover:bg-teal-100 transition-all active:scale-90" title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(p)}
            className={`inline-flex cursor-pointer items-center rounded-xl p-2 transition-all active:scale-90 ${p.is_active ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
            title={p.is_active ? 'Deactivate' : 'Activate'}
          >
            {p.is_active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setDeleteTarget(p)}
            className="inline-flex cursor-pointer items-center rounded-xl bg-red-50 p-2 text-red-600 hover:bg-red-100 transition-all active:scale-90" title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pharmacists</h1>
        <button
          onClick={() => setModalPharmacist(null)}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-all hover:bg-teal-700 active:scale-95"
        >
          <Plus className="h-5 w-5" /> Add Pharmacist
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 ring-1 ring-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100">
        <DataTable columns={columns} data={pharmacists} isLoading={isLoading} emptyMessage="No pharmacists registered yet" emptyIcon={Users} rowKey="id" />
      </div>

      {modalPharmacist !== undefined && (
        <PharmacistModal
          key={modalPharmacist?.id || 'new'}
          isOpen onClose={() => setModalPharmacist(undefined)}
          pharmacist={modalPharmacist ?? null}
          onSaved={async () => { setError(''); await fetchPharmacists(); }}
        />
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)} title="Delete Pharmacist"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"?` : ''}
        confirmText="Delete" loadingText="Deleting..." isLoading={isDeleting} onConfirm={handleDeleteConfirm}
        onCancel={() => (isDeleting ? null : setDeleteTarget(null))}
      />
    </div>
  );
}
