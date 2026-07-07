"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { IsModalVisibleType, ModalContextType } from "@/types";

/** Context for managing modal visibility state (clear chat, return home). */
const ModalContext = createContext<ModalContextType | undefined>(undefined);

/** Provides modal visibility state and controls to child components. */
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState<IsModalVisibleType>({
    newChat: false,
    returnHome: false,
  });

  const setModalVisible = useCallback((modal: keyof IsModalVisibleType) => {
    setIsModalVisible((state) => ({ ...state, [modal]: true }));
  }, []);

  const resetModals = useCallback(() => {
    setIsModalVisible({
      newChat: false,
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

/**
 * Hook to access the modal context.
 *
 * @returns modal visibility state, setModalVisible, and resetModals
 * @throws Error if used outside of ModalProvider
 */
export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
};
