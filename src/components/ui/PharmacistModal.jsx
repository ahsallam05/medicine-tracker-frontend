import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import adminService from '../../api/services/adminService';

function getInitialForm(pharmacist) {
  if (pharmacist) {
    return {
      name: pharmacist.name ?? '',
      username: pharmacist.username ?? '',
      password: '',
    };
  }
  return {
    name: '',
    username: '',
    password: '',
  };
}

export default function PharmacistModal({ isOpen, onClose, pharmacist, onSaved }) {
  const initial = getInitialForm(pharmacist);
  const [name, setName] = useState(initial.name);
  const [username, setUsername] = useState(initial.username);
  const [password, setPassword] = useState(initial.password);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isEdit = Boolean(pharmacist);

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
    () => (isEdit ? 'Edit Pharmacist' : 'Add Pharmacist'),
    [isEdit],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = { name, username };
      if (password) {
        data.password = password;
      }

      if (isEdit) {
        await adminService.update(pharmacist.id, data);
      } else {
        if (!password) {
          setError('Password is required for new pharmacists.');
          setIsSubmitting(false);
          return;
        }
        data.password = password;
        await adminService.create(data);
      }

      onSaved?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} pharmacist.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 cursor-pointer bg-black/40"
        onClick={!isSubmitting ? onClose : undefined}
      />
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            type="button"
            onClick={!isSubmitting ? onClose : undefined}
            disabled={isSubmitting}
            className="cursor-pointer text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Password
              {!isEdit && <span className="text-red-500"> *</span>}
              {isEdit && (
                <span className="ml-1 text-xs font-normal text-slate-500">
                  (leave empty to keep current)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required={!isEdit}
                disabled={isSubmitting}
                className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-teal-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                placeholder={isEdit ? 'Enter new password (optional)' : 'Enter password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={!isSubmitting ? onClose : undefined}
              disabled={isSubmitting}
              className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex cursor-pointer items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isEdit ? (
                'Save Changes'
              ) : (
                'Add Pharmacist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
