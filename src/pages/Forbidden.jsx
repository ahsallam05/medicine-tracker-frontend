import { useNavigate } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
          <ShieldX className="h-10 w-10 text-red-500" />
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tight text-slate-900">403</h1>
          <p className="mt-2 text-lg font-semibold text-slate-700">Access Denied</p>
          <p className="mt-2 text-sm text-slate-500">
            You don&apos;t have permission to access this resource.
          </p>
        </div>
        <button
          onClick={() => navigate('/', { replace: true })}
          className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-teal-100 transition-colors hover:bg-teal-700 active:scale-95"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
