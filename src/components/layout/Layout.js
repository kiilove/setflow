"use client";

import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
// Breadcrumb 컴포넌트 import 추가
import Breadcrumb from "../navigation/Breadcrumb";

const Layout = ({ children, toggleTheme, theme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation(); // useLocation 추가

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
        <header className="bg-card shadow-md z-10 theme-transition">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={handleToggleSidebar}
                className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none md:hidden theme-transition"
                aria-label="Toggle sidebar"
              >
                <FaBars />
              </button>
              {/* Breadcrumb 컴포넌트 추가 */}
              <div className="ml-4">
                <Breadcrumb path={location.pathname} />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none theme-transition"
                aria-label={`Switch to ${
                  theme === "dark" ? "light" : "dark"
                } mode`}
              >
                {theme === "dark" ? (
                  <FaSun size={18} className="text-yellow-300" />
                ) : (
                  <FaMoon size={18} className="text-indigo-600" />
                )}
              </button>
              {/* 여기에 다른 헤더 요소들 (알림, 프로필 등) 추가 가능 */}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background theme-transition">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
