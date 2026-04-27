import { useEffect, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { medicineService } from '../../api';
import { toInputDate, parseApiError } from '../../utils';
import { DEFAULT_CATEGORY, MEDICINE_CATEGORIES } from '../../constants';

function getInitialForm(medicine) {
  if (medicine) {
    return {
      name: medicine.name ?? '',
      category: medicine.category ?? DEFAULT_CATEGORY,
      quantity: medicine.quantity ?? 0,
      expiry_date: toInputDate(medicine.expiry_date),
    };
  }
  return { name: '', category: DEFAULT_CATEGORY, quantity: 0, expiry_date: '' };
}

export default function MedicineModal({ isOpen, onClose, medicine, onSaved }) {
  const [form, setForm] = useState(() => getInitialForm(medicine));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(medicine);
  const title = isEdit ? 'Edit Medicine' : 'Add New Medicine';

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => { if (e.key === 'Escape' && !isSubmitting) onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const data = { ...form, quantity: Number(form.quantity) };
      if (isEdit) await medicineService.update(medicine.id, data);
      else await medicineService.create(data);
      onSaved?.();
      onClose();
    } catch (err) {
      setError(parseApiError(err, 'Failed to save.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in" onClick={!isSubmitting ? onClose : undefined} />
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:text-slate-600 disabled:opacity-50" disabled={isSubmitting}>
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-100">{error}</div>}
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Medicine Name</label>
              <input
                type="text" required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
                placeholder="e.g. Paracetamol"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">Category</label>
              <select
                value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:bg-white"
              >
                {MEDICINE_CATEGORIES.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Quantity</label>
                <input
                  type="number" min="0" required value={form.quantity} onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))} disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-bold text-slate-700">Expiry Date</label>
                <input
                  type="date" required value={form.expiry_date} onChange={(e) => setForm(f => ({ ...f, expiry_date: e.target.value }))} disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-xl px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-teal-700 active:scale-95 disabled:opacity-70">
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (isEdit ? 'Update Medicine' : 'Add Medicine')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
