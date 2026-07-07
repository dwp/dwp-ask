"use client";

import { useEffect } from "react";
import { NewChatModal, ReturnHomeModal } from "@/components";
import { useModal } from "@/providers";
import { clearSession } from "@/utils";

export default function LayoutModals() {
  const { isModalVisible } = useModal();

  /**
   * Hook which determines whether the chat should be cleared or not when the tab receives focus
   */
  useEffect(() => {
    clearSession();
    window.onfocus = () => {
      clearSession();
    };
  }, []);

  return (
    <>
      {isModalVisible.newChat && <NewChatModal />}
      {isModalVisible.returnHome && <ReturnHomeModal />}
    </>
  );
}
