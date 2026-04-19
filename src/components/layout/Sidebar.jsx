import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Bell, LayoutDashboard, Pill, Stethoscope, Users, X } from 'lucide-react';

const linkClass =
  'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors';

function SidebarNav({ onNavigate }) {
  const { user } = useAuth();
  const isAdmin = user?.role?.toLowerCase() === 'admin';
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      <NavLink
        to="/dashboard"
        className={`${linkClass} ${
          isActive('/dashboard')
            ? 'bg-teal-600 text-white'
            : 'text-teal-100 hover:bg-teal-700 hover:text-white'
        }`}
        onClick={onNavigate}
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </NavLink>
      <NavLink
        to="/medicines"
        className={`${linkClass} ${
          isActive('/medicines')
            ? 'bg-teal-600 text-white'
            : 'text-teal-100 hover:bg-teal-700 hover:text-white'
        }`}
        onClick={onNavigate}
      >
        <Pill className="h-4 w-4" />
        Medicines
      </NavLink>
      <NavLink
        to="/alerts"
        className={`${linkClass} ${
          isActive('/alerts')
            ? 'bg-teal-600 text-white'
            : 'text-teal-100 hover:bg-teal-700 hover:text-white'
        }`}
        onClick={onNavigate}
      >
        <Bell className="h-4 w-4" />
        Alerts
      </NavLink>
      {isAdmin ? (
        <NavLink
          to="/admin/pharmacists"
          className={`${linkClass} ${
            isActive('/admin/pharmacists')
              ? 'bg-teal-600 text-white'
              : 'text-teal-100 hover:bg-teal-700 hover:text-white'
          }`}
          onClick={onNavigate}
        >
          <Users className="h-4 w-4" />
          Pharmacists
        </NavLink>
      ) : null}
    </nav>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Desktop - Fixed sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-teal-800 text-white md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
          <Stethoscope className="h-7 w-7 text-white" />
          <div className="text-base font-semibold text-white">Medicine Tracker</div>
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${isOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!isOpen}
      >
        {/* Dark backdrop */}
        <button
          type="button"
          onClick={onClose}
          className={`absolute inset-0 cursor-pointer bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-label="Close menu overlay"
        />
        {/* Mobile sidebar */}
        <aside
          className={`absolute left-0 top-0 h-full w-64 bg-teal-800 text-white shadow-lg transition-transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="h-7 w-7 text-white" />
              <div className="text-base font-semibold text-white">Medicine Tracker</div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-md p-2 text-white/90 hover:bg-teal-700/60"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SidebarNav onNavigate={onClose} />
        </aside>
      </div>
    </>
  );
}
