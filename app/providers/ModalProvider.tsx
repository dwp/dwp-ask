"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

type IsModalVisibleType = {
  clearChat: boolean;
  returnHome: boolean;
};

type ModalContextType = {
  isModalVisible: IsModalVisibleType;
  setModalVisible: (modal: keyof IsModalVisibleType) => void;
  resetModals: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState<IsModalVisibleType>({
    clearChat: false,
    returnHome: false,
  });

  const setModalVisible = useCallback((modal: keyof IsModalVisibleType) => {
    setIsModalVisible((state) => ({ ...state, [modal]: true }));
  }, []);

  const resetModals = useCallback(() => {
    setIsModalVisible({
      clearChat: false,
      returnHome: false,
    });
  }, []);

  const value = useMemo(
    () => ({ isModalVisible, setModalVisible, resetModals }),
    [isModalVisible, setModalVisible, resetModals],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
};
