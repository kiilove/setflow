"use client";

import { useState, useCallback } from "react";

/**
 * 메시지 박스 상태를 관리하는 커스텀 훅
 * @returns {Object} 메시지 박스 상태와 관련 함수들
 */
const useModalMessage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageProps, setMessageProps] = useState({
    title: "",
    message: "",
    type: "info",
    actions: [],
    showCloseButton: true,
    size: "md",
  });

  // 메시지 박스 열기
  const openMessage = useCallback((props) => {
    setMessageProps(props);
    setIsOpen(true);

    // 모바일에서 스크롤 방지를 위한 추가 설정
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    return new Promise((resolve) => {
      // 메시지 박스가 닫힐 때 resolve 호출
      setMessageProps((prev) => ({
        ...prev,
        onClose: () => {
          setIsOpen(false);
          if (props.onClose) props.onClose();
          resolve(false);
        },
      }));
    });
  }, []);

  // 메시지 박스 닫기
  const closeMessage = useCallback(() => {
    setIsOpen(false);

    // 스크롤 복원
    if (typeof window !== "undefined") {
      document.body.style.overflow = "auto";
    }
  }, []);

  // 성공 메시지
  const showSuccess = useCallback(
    (title, message, options = {}) => {
      return openMessage({
        title,
        message,
        type: "success",
        ...options,
      });
    },
    [openMessage]
  );

  // 에러 메시지
  const showError = useCallback(
    (title, message, options = {}) => {
      return openMessage({
        title,
        message,
        type: "error",
        ...options,
      });
    },
    [openMessage]
  );

  // 경고 메시지
  const showWarning = useCallback(
    (title, message, options = {}) => {
      return openMessage({
        title,
        message,
        type: "warning",
        ...options,
      });
    },
    [openMessage]
  );

  // 정보 메시지
  const showInfo = useCallback(
    (title, message, options = {}) => {
      return openMessage({
        title,
        message,
        type: "info",
        ...options,
      });
    },
    [openMessage]
  );

  // 확인 메시지 (Promise 반환)
  const showConfirm = useCallback(
    (title, message, options = {}) => {
      return new Promise((resolve) => {
        openMessage({
          title,
          message,
          type: "confirm",
          actions: [
            {
              label: options.cancelText || "취소",
              onClick: () => {
                closeMessage();
                resolve(false);
              },
              variant: "outline",
            },
            {
              label: options.confirmText || "확인",
              onClick: () => {
                closeMessage();
                resolve(true);
              },
              variant: options.confirmVariant || "primary",
            },
          ],
          showCloseButton:
            options.showCloseButton !== undefined
              ? options.showCloseButton
              : true,
          size: options.size || "md",
          onClose: () => {
            resolve(false);
          },
        });
      });
    },
    [openMessage, closeMessage]
  );

  return {
    isOpen,
    messageProps,
    openMessage,
    closeMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
  };
};

export default useModalMessage;
