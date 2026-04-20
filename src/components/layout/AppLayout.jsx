import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth';
import {
  Bell,
  LayoutDashboard,
  Pill,
  Stethoscope,
  Users,
  X,
  LogOut,
  Menu,
} from 'lucide-react';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl mb-1 ${
    isActive
      ? 'bg-teal-600 text-white shadow-md shadow-teal-200'
      : 'text-slate-600 hover:bg-teal-50 hover:text-teal-700'
  }`;

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white p-4 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-8 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 shadow-lg shadow-teal-100">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">
              MedTracker
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 md:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="space-y-1">
          <NavLink to="/" onClick={onClose} className={linkClass}>
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </NavLink>
          <NavLink to="/medicines" onClick={onClose} className={linkClass}>
            <Pill className="h-5 w-5" />
            Medicines
          </NavLink>
          <NavLink to="/alerts" onClick={onClose} className={linkClass}>
            <Bell className="h-5 w-5" />
            Alerts
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin/pharmacists" onClick={onClose} className={linkClass}>
              <Users className="h-5 w-5" />
              Pharmacists
            </NavLink>
          )}
        </nav>
      </aside>
    </>
  );
}

function Navbar({ onOpenSidebar }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname) => {
    if (pathname === '/') return 'Dashboard Overview';
    if (pathname.includes('/medicines')) return 'Medicine Inventory';
    if (pathname.includes('/alerts')) return 'Notifications & Alerts';
    if (pathname.includes('/pharmacists')) return 'Pharmacist Management';
    return 'Medicine Tracker';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <h2 className="text-lg font-semibold text-slate-800 sm:text-xl">
            {getPageTitle(location.pathname)}
          </h2>
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

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />
      <main className="ml-0 mt-16 p-4 sm:p-6 md:ml-64">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
