"use client";

import { createContext, useContext } from "react";
import ModalMessage from "../components/common/ModalMessage";
import useModalMessage from "../hooks/useModalMessage";

// 메시지 컨텍스트 생성
const MessageContext = createContext(null);

/**
 * 메시지 컨텍스트 제공자 컴포넌트
 */
export const MessageProvider = ({ children }) => {
  const message = useModalMessage();

  return (
    <MessageContext.Provider value={message}>
      {children}
      <ModalMessage
        isOpen={message.isOpen}
        onClose={message.closeMessage}
        {...message.messageProps}
      />
    </MessageContext.Provider>
  );
};

/**
 * 메시지 컨텍스트 사용 훅
 */
export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};
