import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, Menu } from 'lucide-react';

function getPageTitle(pathname) {
  if (pathname.startsWith('/medicines')) return 'Medicines';
  if (pathname.startsWith('/alerts')) return 'Alerts';
  if (pathname.startsWith('/admin/pharmacists')) return 'Pharmacists';
  return 'Dashboard';
}

export default function Navbar({ onOpenSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:left-64">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-slate-700 hover:bg-gray-50 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="text-sm font-semibold text-slate-800">
          {getPageTitle(location.pathname)}
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-700">
        <span className="hidden sm:inline">{user?.name ?? user?.username}</span>
        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
          {user?.role}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-gray-50"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
