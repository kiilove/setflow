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
import { MessageProvider } from "./context/MessageContext";
import { AuthProvider } from "./context/AuthContext";

// 테마 관련 커스텀 훅
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme;
      } else {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
    }
    return "dark";
  });

  useEffect(() => {
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
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
};

// 인증된 라우트를 위한 래퍼 컴포넌트
const ProtectedRoute = ({ children, requiresAuth }) => {
  if (requiresAuth && !isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }
  return children;
};

// 라우팅 컴포넌트
const AppRoutes = ({ theme, toggleTheme, sidebarOpen, toggleSidebar }) => {
  const routes = getAllRoutes();

  return (
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
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const initializeApp = async () => {
      // 실제 초기화 작업을 여기에 추가할 수 있습니다
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    initializeApp();
  }, []);

  if (loading) {
    return <FullScreenLoading />;
  }

  return (
    <AuthProvider>
      <MessageProvider>
        <Router>
          <AppRoutes
            theme={theme}
            toggleTheme={toggleTheme}
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        </Router>
      </MessageProvider>
    </AuthProvider>
  );
};

export default App;
