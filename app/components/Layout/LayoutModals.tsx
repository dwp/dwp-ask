"use client";

import { useEffect } from "react";
import { useModal } from "@/app/providers";
import { ClearChatModal, ReturnHomeModal } from "@/app/components";
import { clearSession } from "@/app/utils";

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
      {isModalVisible.clearChat && <ClearChatModal />}
      {isModalVisible.returnHome && <ReturnHomeModal />}
    </>
  );
}
