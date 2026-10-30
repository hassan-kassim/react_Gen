"use client";

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './pages/dashboard/sideBar/sidebar';
import TopHeader from './pages/dashboard/header/header';

export default function AppShell({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (pathname === '/') {
    return children;
  }

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-800">
      {sidebarOpen && (
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopHeader
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        {children}
      </div>
    </div>
  );
}
