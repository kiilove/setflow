"use client";

import { createContext, useContext, useState } from "react";
import ModalMessage from "../components/common/ModalMessage";

const ConfirmContext = createContext();

export const ConfirmProvider = ({ children }) => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showConfirm = (title, message, onConfirm) => {
    setConfirmState({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleConfirm = () => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
    setConfirmState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  const handleClose = () => {
    setConfirmState({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
    });
  };

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      <ModalMessage
        isOpen={confirmState.isOpen}
        onClose={handleClose}
        title={confirmState.title}
        message={confirmState.message}
        type="confirm"
        actions={[
          {
            label: "취소",
            onClick: handleClose,
            variant: "outline",
          },
          {
            label: "확인",
            onClick: handleConfirm,
            variant: "primary",
          },
        ]}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
