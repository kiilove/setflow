"use client";
import { FaBars, FaSun, FaMoon } from "react-icons/fa";
import Breadcrumb from "../navigation/Breadcrumb";

const Header = ({ toggleSidebar, toggleTheme, theme }) => {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-700/30 bg-slate-800 px-4 w-full shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-slate-200 hover:bg-slate-700/40 hover:text-white p-2 rounded-md"
        >
          <FaBars className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </button>
        <h1 className="text-xl font-bold text-white">Setflow</h1>
        <div className="hidden md:block ml-4">
          <Breadcrumb />
        </div>
      </div>
      <button
        onClick={toggleTheme}
        className="text-slate-200 hover:bg-slate-700/40 hover:text-white p-2 rounded-md"
      >
        {theme === "dark" ? (
          <FaSun className="h-5 w-5" />
        ) : (
          <FaMoon className="h-5 w-5" />
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    </header>
  );
};

export default Header;
