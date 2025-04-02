"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { getSidebarRoutes } from "../../routes";

const Sidebar = ({ isOpen, toggleSidebar, theme }) => {
  const location = useLocation();
  const sidebarRoutes = getSidebarRoutes();

  // 현재 열린 서브메뉴 상태 관리 (하나의 ID만 저장)
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // 서브메뉴 토글 함수 - 하나의 서브메뉴만 열리도록 함
  const toggleSubmenu = (id) => {
    setActiveSubmenu(activeSubmenu === id ? null : id);
  };

  // 메뉴 클릭 핸들러: 모바일 환경일 경우 드로어 메뉴 닫기
  const handleMenuClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  // 현재 경로가 활성화된 메뉴인지 확인
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // 현재 경로가 특정 부모 메뉴에 속하는지 확인
  const isChildRouteActive = (children) => {
    if (!children) return false;
    return children.some((child) => location.pathname === child.path);
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed md:static h-screen overflow-y-auto overflow-x-hidden border-r border-border sidebar theme-transition z-30 ${
          isOpen ? "w-64 left-0" : "w-64 -left-64 md:left-0"
        }`}
      >
        {/* 헤더 */}
        <div className="border-b border-border p-4 theme-transition">
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={handleMenuClick}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary shadow-md">
              <span className="text-lg font-bold text-primary-foreground">
                SF
              </span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              Setflow
            </span>
          </Link>
        </div>

        {/* 컨텐츠 */}
        <div className="overflow-x-hidden px-2 py-4">
          <ul>
            {sidebarRoutes.map((route) => (
              <li key={route.id} className="mb-1">
                {route.children ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(route.id)}
                      className={`w-full flex justify-between items-center px-3 py-2 rounded-md theme-transition ${
                        isChildRouteActive(route.children)
                          ? "bg-primary/10 text-foreground"
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex w-5 justify-center">
                          <route.icon className="h-5 w-5" />
                        </div>
                        <span>{route.title}</span>
                      </div>
                      <div className="flex w-5 justify-center">
                        {activeSubmenu === route.id ? (
                          <FaChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                        ) : (
                          <FaChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                        )}
                      </div>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        activeSubmenu === route.id
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="ml-8 mt-1 border-l border-border pl-4">
                        {route.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              to={child.path}
                              className={`block py-1.5 theme-transition ${
                                isActiveRoute(child.path)
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                              onClick={handleMenuClick}
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    to={route.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md theme-transition ${
                      isActiveRoute(route.path)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}
                    onClick={handleMenuClick}
                  >
                    <div className="flex w-5 justify-center">
                      <route.icon className="h-5 w-5" />
                    </div>
                    <span>{route.title}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
