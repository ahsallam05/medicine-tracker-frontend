import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar - Desktop: always visible, Mobile: overlay */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Fixed Navbar */}
      <Navbar onOpenSidebar={() => setIsSidebarOpen(true)} />

      {/* Main Content - uses browser page scroll */}
      <main className="ml-0 mt-16 min-h-[calc(100vh-64px)] p-6 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
