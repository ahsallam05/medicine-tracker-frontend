import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Power, PowerOff, AlertCircle, Users } from 'lucide-react';
import adminService from '../../api/services/adminService';
import PharmacistModal from '../../components/ui/PharmacistModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Spinner from '../../components/ui/Spinner';

export default function PharmacistList() {
  const [pharmacists, setPharmacists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPharmacist, setEditingPharmacist] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingPharmacist, setDeletingPharmacist] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await adminService.getAll();
      const pharmacists = response?.data?.data ?? [];
      setPharmacists(pharmacists);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to load pharmacists.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError('');
      try {
        const response = await adminService.getAll();
        if (!isMounted) return;
        const pharmacists = response?.data?.data ?? [];
        setPharmacists(pharmacists);
      } catch (err) {
        if (!isMounted) return;
        setError(
          err?.response?.data?.message || 'Failed to load pharmacists.',
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAdd = () => {
    setEditingPharmacist(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pharmacist) => {
    setEditingPharmacist(pharmacist);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPharmacist(null);
  };

  const handleSaved = () => {
    refetch();
  };

  const handleToggleStatus = async (pharmacist) => {
    try {
      await adminService.updateStatus(pharmacist.id, !pharmacist.is_active);
      refetch();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to update status.',
      );
    }
  };

  const handleDeleteClick = (pharmacist) => {
    setDeletingPharmacist(pharmacist);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingPharmacist) return;
    setIsDeleting(true);
    try {
      await adminService.remove(deletingPharmacist.id);
      setIsConfirmOpen(false);
      setDeletingPharmacist(null);
      refetch();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to delete pharmacist.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeletingPharmacist(null);
  };

  if (isLoading) {
    return <Spinner className="py-12" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-800">Pharmacists</h1>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          <Plus className="h-4 w-4" />
          Add Pharmacist
        </button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pharmacists.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center text-sm text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-8 w-8 text-slate-300" />
                    <span>No pharmacists found</span>
                  </div>
                </td>
              </tr>
            ) : (
              pharmacists.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {p.username}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        p.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(p)}
                        className="inline-flex cursor-pointer items-center rounded-md bg-teal-50 p-1.5 text-teal-600 hover:bg-teal-100"
                        aria-label="Edit"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p)}
                        className={`inline-flex cursor-pointer items-center rounded-md p-1.5 ${
                          p.is_active
                            ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                            : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }`}
                        aria-label={p.is_active ? 'Deactivate' : 'Activate'}
                        title={p.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {p.is_active ? (
                          <PowerOff className="h-4 w-4" />
                        ) : (
                          <Power className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteClick(p)}
                        className="inline-flex cursor-pointer items-center rounded-md bg-red-50 p-1.5 text-red-600 hover:bg-red-100"
                        aria-label="Delete"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen ? (
        <PharmacistModal
          key={editingPharmacist?.id ?? 'add'}
          isOpen
          onClose={handleCloseModal}
          pharmacist={editingPharmacist}
          onSaved={handleSaved}
        />
      ) : null}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Pharmacist"
        message={`Are you sure you want to delete "${deletingPharmacist?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

