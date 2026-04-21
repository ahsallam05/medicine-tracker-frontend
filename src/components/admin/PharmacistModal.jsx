import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, X } from 'lucide-react';
import { adminService } from '../../api';

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
  const title = isEdit ? 'Edit Pharmacist' : 'Register Pharmacist';

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = { name, username };
      if (password) data.password = password;

      if (isEdit) {
        await adminService.update(pharmacist.id, data);
      } else {
        if (!password) {
          setError('Password is required for registration.');
          setIsSubmitting(false);
          return;
        }
        await adminService.create(data);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      console.error('Pharmacist Save Error:', err.response?.data);
      const serverData = err?.response?.data;
      const serverMessage = serverData?.message || serverData?.error;
      const serverErrors = serverData?.errors || serverData?.details;

      if (serverErrors && typeof serverErrors === 'object') {
        const detail = Object.values(serverErrors).join(', ');
        setError(detail || serverMessage || 'Validation failed.');
      } else if (serverMessage) {
        setError(serverMessage);
      } else {
        setError(`Failed to ${isEdit ? 'update' : 'create'} pharmacist.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={!isSubmitting ? onClose : undefined}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-300 ring-1 ring-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button
            onClick={!isSubmitting ? onClose : undefined}
            className="rounded-xl p-2 text-slate-400 hover:bg-white hover:text-slate-600 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
              placeholder="e.g. john.doe"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-700">
              Password {isEdit && <span className="text-xs font-normal text-slate-500 ml-1">(leave empty to keep current)</span>}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required={!isEdit}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 pr-11 text-sm text-slate-900 outline-none transition-all focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-50"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-teal-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-all hover:bg-teal-700 hover:shadow-teal-200 active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (isEdit ? 'Save Changes' : 'Register')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
