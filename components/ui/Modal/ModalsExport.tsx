"use client";

import { useRouter } from "next/navigation";
import { MODALS } from "@/constants/Modals";
import { clearHistory } from "@/utils";
import Modal from "./Modal";

const { newChat, returnHome } = MODALS;

export function NewChatModal() {
  return (
    <Modal
      heading={newChat.heading}
      confirm={newChat.confirm}
      closeText={newChat.closeText}
      type={newChat.type}
    />
  );
}

export function ReturnHomeModal() {
  const router = useRouter();

  const returnHomeAction = () => {
    clearHistory();
    router.push("/");
  };

  return (
    <Modal
      heading={returnHome.heading}
      confirm={{ text: returnHome.confirm.text, action: returnHomeAction }}
      closeText={returnHome.closeText}
      type={returnHome.type}
    />
  );
}
