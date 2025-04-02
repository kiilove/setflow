"use client";

import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import { getAllRoutes } from "./routes";
import "./styles/globals.css";

const App = () => {
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

  // 테마 전환 함수
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  return (
    <Router>
      <Layout toggleTheme={toggleTheme} theme={theme}>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.id}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
