"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 인증 상태를 확인하는 컴포넌트
const CheckAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 로컬 스토리지에서 인증 정보 확인
    const authUser = localStorage.getItem("authUser");

    if (authUser) {
      // 인증 정보가 있으면 홈으로 리다이렉트
      navigate("/dashboard");
    } else {
      // 인증 정보가 없으면 로그인 페이지로 리다이렉트
      navigate("/auth/login");
    }
  }, [navigate]);

  // 리다이렉트 중에는 아무것도 렌더링하지 않음
  return null;
};

// 인증 상태 확인 함수
export const isAuthenticated = () => {
  const authUser = localStorage.getItem("authUser");
  return !!authUser;
};

// 현재 인증된 사용자 정보 가져오기
export const getCurrentUser = () => {
  const authUser = localStorage.getItem("authUser");
  return authUser ? JSON.parse(authUser) : null;
};

// 로그아웃 함수
export const logout = () => {
  localStorage.removeItem("authUser");
  window.location.href = "/auth/login";
};

export default CheckAuth;
