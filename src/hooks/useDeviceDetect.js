"use client";

import { useState, useEffect } from "react";

/**
 * 디바이스 감지를 위한 커스텀 훅
 * @returns {Object} 디바이스 관련 상태 및 함수
 */
const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [orientation, setOrientation] = useState(null); // 'portrait' 또는 'landscape'
  const [touchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    // 초기 설정
    const checkDevice = () => {
      // 모바일 감지 (768px 미만)
      setIsMobile(window.innerWidth < 768);

      // 태블릿 감지 (768px 이상, 1024px 미만)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);

      // 데스크톱 감지 (1024px 이상)
      setIsDesktop(window.innerWidth >= 1024);

      // 방향 감지
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    // 터치 디바이스 감지
    const checkTouchDevice = () => {
      setTouchDevice(
        "ontouchstart" in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
      );
    };

    // 초기 실행
    checkDevice();
    checkTouchDevice();

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener("resize", checkDevice);

    // 방향 변경 이벤트 리스너 등록 (모바일 기기에서 작동)
    window.addEventListener("orientationchange", checkDevice);

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", checkDevice);
      window.removeEventListener("orientationchange", checkDevice);
    };
  }, []);

  // 특정 브레이크포인트 이하인지 확인하는 함수
  const isBelowBreakpoint = (breakpoint) => {
    return window.innerWidth < breakpoint;
  };

  // 특정 브레이크포인트 이상인지 확인하는 함수
  const isAboveBreakpoint = (breakpoint) => {
    return window.innerWidth >= breakpoint;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    orientation,
    touchDevice,
    isBelowBreakpoint,
    isAboveBreakpoint,
  };
};

export default useDeviceDetect;
