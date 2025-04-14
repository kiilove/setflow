"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

// 메시지 타입에 따른 아이콘과 색상 설정
const messageConfig = {
  success: {
    icon: FaCheckCircle,
    iconClass: "text-green-500 dark:text-green-400",
    headerClass:
      "bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800",
    ringClass: "ring-green-500/20 dark:ring-green-400/20",
  },
  error: {
    icon: FaTimesCircle,
    iconClass: "text-red-500 dark:text-red-400",
    headerClass:
      "bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800",
    ringClass: "ring-red-500/20 dark:ring-red-400/20",
  },
  warning: {
    icon: FaExclamationTriangle,
    iconClass: "text-yellow-500 dark:text-yellow-400",
    headerClass:
      "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-100 dark:border-yellow-800",
    ringClass: "ring-yellow-500/20 dark:ring-yellow-400/20",
  },
  info: {
    icon: FaInfoCircle,
    iconClass: "text-blue-500 dark:text-blue-400",
    headerClass:
      "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800",
    ringClass: "ring-blue-500/20 dark:ring-blue-400/20",
  },
  confirm: {
    icon: FaExclamationCircle,
    iconClass: "text-blue-500 dark:text-blue-400",
    headerClass:
      "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800",
    ringClass: "ring-blue-500/20 dark:ring-blue-400/20",
  },
};

/**
 * 재사용 가능한 메시지 박스 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 메시지 박스 표시 여부
 * @param {function} props.onClose - 메시지 박스 닫기 함수
 * @param {string} props.title - 메시지 박스 제목
 * @param {string} props.message - 메시지 내용
 * @param {string} props.type - 메시지 타입 (success, error, warning, info, confirm)
 * @param {Array} props.actions - 메시지 박스 하단 버튼 배열 [{label, onClick, variant}]
 * @param {boolean} props.showCloseButton - 닫기 버튼 표시 여부
 * @param {string} props.size - 메시지 박스 크기 (sm, md, lg, xl)
 * @param {React.ReactNode} props.children - 메시지 박스 내용 (message 대신 사용 가능)
 */
const ModalMessage = ({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  actions = [],
  showCloseButton = true,
  size = "md",
  children,
}) => {
  // 메시지 박스 ref
  const modalRef = useRef(null);

  // 메시지 박스가 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // 모바일에서 스크롤 방지를 위한 추가 설정
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";

      // 스크롤 위치 복원
      const scrollY = document.body.style.top;
      document.body.style.top = "";
      if (scrollY) {
        window.scrollTo(0, Number.parseInt(scrollY || "0", 10) * -1);
      }
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
    };
  }, [isOpen]);

  // ESC 키로 메시지 박스 닫기
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // 메시지 박스 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 메시지 박스 외부 클릭 시 이벤트 전파 중지 (닫히지 않도록)
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        event.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // 메시지 박스가 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 메시지 설정 가져오기
  const config = messageConfig[type] || messageConfig.info;
  const Icon = config.icon;

  // 메시지 박스 크기 설정
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  };
  const messageSizeClass = sizeClasses[size] || sizeClasses.md;

  // 메시지 박스 내부 클릭 시 이벤트 전파 중지 (배경 클릭 이벤트 방지)
  const handleMessageContentClick = (e) => {
    e.stopPropagation();
  };

  // 기본 확인 버튼 (actions가 없을 경우)
  const defaultActions = [
    {
      label: "확인",
      onClick: onClose,
      variant: type === "confirm" ? "primary" : type,
    },
  ];

  // 확인/취소 버튼 (confirm 타입일 경우)
  const confirmActions = [
    {
      label: "취소",
      onClick: onClose,
      variant: "outline",
    },
    {
      label: "확인",
      onClick: () => {
        if (actions[0]?.onClick) actions[0].onClick();
        if (onClose) onClose();
      },
      variant: "primary",
    },
  ];

  // 사용할 액션 버튼 결정
  const buttonsToRender =
    actions.length > 0
      ? actions
      : type === "confirm"
      ? confirmActions
      : defaultActions;

  // 버튼 스타일 클래스
  const getButtonClass = (variant) => {
    const baseClass =
      "px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";

    switch (variant) {
      case "primary":
        return `${baseClass} bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-primary dark:focus:ring-offset-gray-900`;
      case "success":
        return `${baseClass} bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 dark:focus:ring-offset-gray-900`;
      case "error":
        return `${baseClass} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:focus:ring-offset-gray-900`;
      case "warning":
        return `${baseClass} bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 dark:focus:ring-offset-gray-900`;
      case "info":
        return `${baseClass} bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:focus:ring-offset-gray-900`;
      case "outline":
        return `${baseClass} border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-primary dark:focus:ring-offset-gray-900`;
      default:
        return `${baseClass} bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-primary dark:focus:ring-offset-gray-900`;
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={`w-full ${messageSizeClass} bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-200 ease-out scale-100 opacity-100 ${config.ringClass} ring-1`}
        onClick={handleMessageContentClick}
      >
        {/* 메시지 박스 헤더 */}
        <div
          className={`px-6 py-4 flex items-center justify-between ${config.headerClass} border-b dark:border-gray-700`}
        >
          <div className="flex items-center">
            <Icon className={`mr-3 h-6 w-6 ${config.iconClass}`} />
            <h3
              id="modal-title"
              className="text-lg font-medium text-gray-900 dark:text-gray-100"
            >
              {title}
            </h3>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1 transition-colors"
              aria-label="Close"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* 메시지 박스 내용 */}
        <div className="px-6 py-4">
          {children || (
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {message}
            </div>
          )}
        </div>

        {/* 메시지 박스 푸터 (버튼) */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap justify-end gap-2 border-t border-gray-200 dark:border-gray-700">
          {buttonsToRender.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={getButtonClass(action.variant)}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalMessage;
