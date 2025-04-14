"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  FaCheckCircle,
  FaInfoCircle,
  FaTimesCircle,
  FaTimes,
  FaSpinner,
  FaChevronRight,
} from "react-icons/fa";

/**
 * 처리 과정을 단계별로 보여주는 메시지 박스 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 메시지 박스 표시 여부
 * @param {function} props.onClose - 메시지 박스 닫기 함수
 * @param {string} props.title - 메시지 박스 제목
 * @param {Array} props.steps - 처리 단계 배열 [{title, status, description}]
 * @param {string} props.status - 전체 처리 상태 (idle, processing, success, error)
 * @param {boolean} props.allowClose - 닫기 버튼 활성화 여부
 */
const ProcessMessageBox = ({
  isOpen,
  onClose,
  title = "처리 진행 상태",
  steps = [],
  status = "idle",
  allowClose = true,
}) => {
  // 메시지 박스가 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // ESC 키로 메시지 박스 닫기 (allowClose가 true일 때만)
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isOpen && onClose && allowClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose, allowClose]);

  // 메시지 박스가 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 상태에 따른 아이콘과 색상 설정
  const getStatusIcon = (stepStatus) => {
    switch (stepStatus) {
      case "success":
        return (
          <FaCheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />
        );
      case "error":
        return (
          <FaTimesCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
        );
      case "processing":
        return (
          <FaSpinner className="h-4 w-4 text-blue-500 dark:text-blue-400 animate-spin" />
        );
      case "waiting":
        return <FaChevronRight className="h-4 w-4 text-gray-400" />;
      default:
        return <FaInfoCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  // 전체 상태에 따른 헤더 스타일 설정
  const getHeaderStyle = () => {
    switch (status) {
      case "success":
        return "bg-green-50 dark:bg-green-900/30 border-green-100 dark:border-green-800";
      case "error":
        return "bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-800";
      case "processing":
        return "bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800";
      default:
        return "bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700";
    }
  };

  // 전체 상태에 따른 아이콘 설정
  const getHeaderIcon = () => {
    switch (status) {
      case "success":
        return (
          <FaCheckCircle className="mr-3 h-6 w-6 text-green-500 dark:text-green-400" />
        );
      case "error":
        return (
          <FaTimesCircle className="mr-3 h-6 w-6 text-red-500 dark:text-red-400" />
        );
      case "processing":
        return (
          <FaSpinner className="mr-3 h-6 w-6 text-blue-500 dark:text-blue-400 animate-spin" />
        );
      default:
        return (
          <FaInfoCircle className="mr-3 h-6 w-6 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  // 메시지 박스 컨테이너 스타일 수정 - 항상 화면 중앙에 표시되도록 z-index 증가 및 스타일 조정
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
        {/* 메시지 박스 헤더 */}
        <div
          className={`px-6 py-4 flex items-center justify-between ${getHeaderStyle()} border-b dark:border-gray-700`}
        >
          <div className="flex items-center">
            {getHeaderIcon()}
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {title}
            </h3>
          </div>
          {allowClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1 transition-colors"
              aria-label="Close"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* 메시지 박스 내용 - 처리 단계 */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative pl-10 animate-in fade-in slide-in-from-right-5 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* 타임라인 연결선 (첫 번째 항목 제외) */}
                {index > 0 && (
                  <div className="absolute left-4 top-0 -translate-y-full h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                )}

                {/* 타임라인 원형 마커 */}
                <div
                  className={`absolute left-0 top-0 h-8 w-8 rounded-full flex items-center justify-center
                    ${
                      step.status === "success"
                        ? "bg-green-100 dark:bg-green-900/30 border-4 border-green-500 dark:border-green-600"
                        : step.status === "error"
                        ? "bg-red-100 dark:bg-red-900/30 border-4 border-red-500 dark:border-red-600"
                        : step.status === "processing"
                        ? "bg-blue-100 dark:bg-blue-900/30 border-4 border-blue-500 dark:border-blue-600 animate-pulse"
                        : "bg-gray-100 dark:bg-gray-800 border-4 border-gray-300 dark:border-gray-600"
                    }`}
                >
                  {getStatusIcon(step.status)}
                </div>

                {/* 이벤트 카드 */}
                <div
                  className="rounded-lg border border-border bg-card p-4 shadow-sm animate-in fade-in slide-in-from-right-5 duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 메시지 박스 푸터 */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 flex justify-end border-t border-gray-200 dark:border-gray-700">
          {status === "processing" ? (
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <FaSpinner className="animate-spin mr-2 h-4 w-4" />
              처리 중...
            </div>
          ) : status === "success" ? (
            <button
              onClick={onClose}
              disabled={!allowClose}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              완료
            </button>
          ) : (
            <button
              onClick={onClose}
              disabled={!allowClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              확인
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ProcessMessageBox;
