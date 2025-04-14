"use client";

import { useEffect } from "react";
import {
  Info,
  CreditCard,
  MapPin,
  Cpu,
  ImageIcon,
  FileText,
  Layers,
} from "lucide-react";
import useDeviceDetect from "../../hooks/useDeviceDetect";

/**
 * 자산 폼 네비게이션 컴포넌트
 * @param {Object} props
 * @param {string} props.activeSection - 현재 활성화된 섹션 ID
 * @param {Function} props.onSectionChange - 섹션 변경 핸들러
 * @param {Object} props.containerRef - 폼 컨테이너 ref
 */
const FormNavigation = ({ activeSection, onSectionChange, containerRef }) => {
  // 디바이스 감지 훅 사용
  const { isMobile } = useDeviceDetect();

  // 네비게이션 아이템 정의 (lucide-react 아이콘으로 변경)
  const navItems = [
    {
      id: "category",
      label: "카테고리",
      icon: Layers,
      color: "text-purple-500",
    },
    { id: "basic", label: "기본 정보", icon: Info, color: "text-blue-500" },
    {
      id: "purchase",
      label: "구매 정보",
      icon: CreditCard,
      color: "text-green-500",
    },
    {
      id: "location",
      label: "위치 및 할당",
      icon: MapPin,
      color: "text-amber-500",
    },
    { id: "specs", label: "사양 정보", icon: Cpu, color: "text-red-500" },
    {
      id: "files",
      label: "이미지 및 파일",
      icon: ImageIcon,
      color: "text-indigo-500",
    },
    { id: "notes", label: "비고", icon: FileText, color: "text-teal-500" },
  ];

  // 스크롤 위치에 따른 활성 섹션 업데이트
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[data-section]");
      const scrollPosition = window.scrollY + 100; // 오프셋 추가

      let currentSection = activeSection;
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentSection = section.getAttribute("data-section");
        }
      });

      if (currentSection !== activeSection) {
        onSectionChange(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection, onSectionChange]);

  // 섹션 클릭 핸들러
  const handleSectionClick = (sectionId) => {
    // 먼저 상태 업데이트
    onSectionChange(sectionId);

    // 해당 섹션으로 스크롤
    setTimeout(() => {
      // ID로 직접 요소 찾기
      const section = document.getElementById(`section-${sectionId}`);

      if (section) {
        // scrollIntoView 메서드 사용
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        // 대체 방법으로 data-section 속성으로 찾기 시도
        const sectionByData = document.querySelector(
          `[data-section="${sectionId}"]`
        );
        if (sectionByData) {
          sectionByData.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    }, 100); // DOM 업데이트 후 스크롤 실행을 위한 지연
  };

  // 모바일 네비게이션 (하단 고정)
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10 px-2 py-1">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-md ${
                  activeSection === item.id
                    ? item.color
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 데스크톱 네비게이션 (왼쪽 사이드바)
  return (
    <div className="w-64 flex-shrink-0 hidden md:block">
      <div className="sticky top-20 border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="bg-muted/30 py-3 px-4 border-b border-border">
          <h3 className="font-medium text-sm">자산 정보 입력</h3>
        </div>
        <ul className="py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleSectionClick(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-sm transition-colors ${
                    activeSection === item.id
                      ? `bg-${item.color.split("-")[1]}-50 dark:bg-${
                          item.color.split("-")[1]
                        }-900/20 ${item.color} font-medium border-l-2 border-${
                          item.color.split("-")[1]
                        }-500`
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Icon
                    className={`mr-3 h-4 w-4 flex-shrink-0 ${
                      activeSection === item.id ? item.color : ""
                    }`}
                    strokeWidth={1.5}
                  />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FormNavigation;
