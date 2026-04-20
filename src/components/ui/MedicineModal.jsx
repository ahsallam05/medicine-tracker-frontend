import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, X } from 'lucide-react';
import medicineService from '../../api/services/medicineService';

const CATEGORIES = [
  'Antipyretics',
  'Antibiotics',
  'Antidiabetics',
  'Cardiovascular',
  'Respiratory',
  'Gastrointestinal',
  'Neurological',
  'Supplements',
  'Dermatology',
  'Ophthalmology',
  'Endocrinology',
  'Antivirals',
  'Urology',
];

function toInputDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

function getInitialForm(medicine) {
  if (medicine) {
    return {
      name: medicine.name ?? '',
      category: medicine.category ?? CATEGORIES[0],
      quantity: Number(medicine.quantity ?? 0),
      expiryDate: toInputDate(medicine.expiry_date),
    };
  }
  return {
    name: '',
    category: CATEGORIES[0],
    quantity: 0,
    expiryDate: '',
  };
}

function CategorySelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (category) => {
    onChange(category);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
      >
        <span>{value}</span>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="category-dropdown absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <div className="max-h-[200px] overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleSelect(cat)}
                className={`w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-gray-100 ${
                  value === cat ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MedicineModal({ isOpen, onClose, medicine, onSaved }) {
  const initial = getInitialForm(medicine);
  const [name, setName] = useState(initial.name);
  const [category, setCategory] = useState(initial.category);
  const [quantity, setQuantity] = useState(initial.quantity);
  const [expiryDate, setExpiryDate] = useState(initial.expiryDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(medicine);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const title = useMemo(
    () => (isEdit ? 'Edit Medicine' : 'Add Medicine'),
    [isEdit],
  );

  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      name: name.trim(),
      category,
      quantity: Number(quantity),
      expiry_date: expiryDate,
    };

    try {
      if (isEdit) {
        await medicineService.update(medicine.id, payload);
      } else {
        await medicineService.create(payload);
      }
      await onSaved?.();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save medicine.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close medicine modal"
        onClick={() => (isSubmitting ? null : onClose())}
        className="absolute inset-0 cursor-pointer bg-black/40"
      />

      <div className="relative w-full max-w-lg rounded-xl bg-white p-5 shadow-lg ring-1 ring-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            type="button"
            onClick={() => (isSubmitting ? null : onClose())}
            disabled={isSubmitting}
            className="cursor-pointer rounded-md p-2 text-slate-400 hover:bg-gray-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Category
            </label>
            <CategorySelect value={category} onChange={setCategory} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Quantity
            </label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(event) => setExpiryDate(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-slate-800 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {error ? (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex cursor-pointer items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                'Update Medicine'
              ) : (
                'Add Medicine'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
