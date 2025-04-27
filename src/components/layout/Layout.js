"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children, toggleTheme, theme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`flex h-screen theme-transition ${theme}`}>
      <Sidebar
        isOpen={sidebarOpen}
        toggleSidebar={handleToggleSidebar}
        theme={theme}
      />

      <div className="flex-1 flex flex-col overflow-hidden bg-background text-foreground theme-transition">
        <Header
          toggleSidebar={handleToggleSidebar}
          toggleTheme={toggleTheme}
          theme={theme}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background theme-transition">
          <div className="p-2 pb-24 sm:p-4">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
