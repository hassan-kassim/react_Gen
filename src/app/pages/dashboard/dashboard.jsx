"use client";

import React, { useState } from 'react';
import Sidebar from './sideBar/sidebar';
import MainContent from './MainContent/main';
import TopHeader from './header/header';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    // <>
    //   <LoginPage />
    // </>

    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
      {sidebarOpen ?
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={toggleSidebar}
        /> : null
      }
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopHeader 
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <MainContent />
      </div>
    </div>

  );
}
