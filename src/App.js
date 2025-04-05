"use client";

import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import { getAllRoutes } from "./routes";
import { isAuthenticated } from "./utils/checkAuth";
import FullScreenLoading from "./components/common/FullScreenLoading";
import "./styles/globals.css";

const App = () => {
  // 로딩 상태 추가
  const [loading, setLoading] = useState(true);

  // 로컬 스토리지에서 테마 설정 불러오기 (기본값: dark)
  const [theme, setTheme] = useState(() => {
    // 브라우저에서 실행 중인지 확인 (SSR 대응)
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");

      // 저장된 테마가 있으면 사용, 없으면 시스템 설정 확인
      if (savedTheme) {
        return savedTheme;
      } else {
        // 시스템 다크 모드 설정 확인
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    }

    return "dark"; // 기본값
  });

  const routes = getAllRoutes();

  // 테마 변경 시 HTML 클래스 및 로컬 스토리지 업데이트
  useEffect(() => {
    // HTML 문서 전체에 테마 클래스 적용
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }

    // 테마 설정 저장
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 앱 초기화 시 로딩 효과
  useEffect(() => {
    // 앱 초기화 작업 (데이터 로드, 인증 확인 등)
    const initializeApp = async () => {
      // 실제 초기화 작업을 여기에 추가할 수 있습니다

      // 로딩 시간을 시뮬레이션 (실제 앱에서는 필요한 초기화 작업이 완료될 때까지 기다림)
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    initializeApp();
  }, []);

  // 테마 전환 함수
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // 인증이 필요한 라우트를 위한 래퍼 컴포넌트
  const ProtectedRoute = ({ children, requiresAuth }) => {
    if (requiresAuth && !isAuthenticated()) {
      // 인증이 필요하지만 인증되지 않은 경우 로그인 페이지로 리다이렉트
      return <Navigate to="/auth/login" replace />;
    }

    return children;
  };

  // 로딩 중이면 로딩 컴포넌트 표시
  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <Router>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.id}
            path={route.path}
            element={
              route.standalone ? (
                <route.component />
              ) : (
                <ProtectedRoute requiresAuth={route.requiresAuth}>
                  <Layout
                    toggleTheme={toggleTheme}
                    theme={theme}
                    toggleSidebar={toggleSidebar}
                    sidebarOpen={sidebarOpen}
                  >
                    <route.component />
                  </Layout>
                </ProtectedRoute>
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
};

export default App;
