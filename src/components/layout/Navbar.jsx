import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import { LogOut, Menu } from 'lucide-react';

// Route map replaces fragile pathname.includes() matching
const PAGE_TITLES = {
  '/':                  'Dashboard Overview',
  '/medicines':         'Medicine Inventory',
  '/alerts':            'Notifications & Alerts',
  '/admin/pharmacists': 'Pharmacist Management',
};

export default function Navbar({ onOpenSidebar }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const title = PAGE_TITLES[location.pathname] ?? 'Medicine Tracker';

  return (
    <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md md:left-64">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-800 sm:text-sm leading-tight">{user?.name}</span>
            <span className="text-[10px] font-medium capitalize text-slate-500 sm:text-xs leading-tight">
              {user?.role}
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-1 block" />
          <button
            onClick={handleLogout}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
