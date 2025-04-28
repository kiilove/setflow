"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Bell, Sun, Moon, Settings, LogOut, User } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import Breadcrumb from "../navigation/Breadcrumb";
import { useAuth } from "../../context/AuthContext";

const Header = ({ toggleSidebar, toggleTheme, theme }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  // Firebase Auth 정보 출력
  useEffect(() => {
    console.log("[Header] Firebase Auth 정보:", {
      currentUser: auth.currentUser,
      userContext: user,
      authState: auth,
    });
  }, [auth, user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/auth/login");
    } catch (error) {
      console.error("로그아웃 에러:", error);
    }
  };

  return (
    <header className="bg-card shadow-md z-10 theme-transition h-[72px] border-b border-border">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none md:hidden theme-transition"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* 테마 전환 버튼 */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none theme-transition"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-600" />
            )}
          </button>

          {/* 알림 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setDropdownOpen(false);
              }}
              className="p-2 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg border border-border z-50">
                <div className="p-3 border-b border-border">
                  <h3 className="font-medium">알림</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-3 border-b border-border hover:bg-muted/50 cursor-pointer">
                    <p className="text-sm font-medium">
                      새로운 자산이 등록되었습니다
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      방금 전
                    </p>
                  </div>
                  <div className="p-3 border-b border-border hover:bg-muted/50 cursor-pointer">
                    <p className="text-sm font-medium">
                      유지보수 일정이 추가되었습니다
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      1시간 전
                    </p>
                  </div>
                  <div className="p-3 hover:bg-muted/50 cursor-pointer">
                    <p className="text-sm font-medium">시스템 업데이트 완료</p>
                    <p className="text-xs text-muted-foreground mt-1">어제</p>
                  </div>
                </div>
                <div className="p-3 border-t border-border">
                  <Link
                    to="/notifications"
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    모든 알림 보기
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 사용자 드롭다운 */}
          <div className="relative">
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {user?.displayName?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden md:inline-block font-medium">
                {user?.displayName || "사용자"}
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg border border-border z-50">
                <div className="p-3 border-b border-border">
                  <p className="font-medium">{user?.displayName || "사용자"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 hover:bg-muted/50 w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    프로필
                  </Link>
                  <Link
                    to="/settings/company"
                    className="flex items-center px-4 py-2 hover:bg-muted/50 w-full text-left"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    설정
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 hover:bg-muted/50 w-full text-left text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
