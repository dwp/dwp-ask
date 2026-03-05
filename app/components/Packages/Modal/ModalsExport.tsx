"use client";

import { useRouter } from "next/navigation";
import { clearHistory, confirmClearChat } from "@/app/utils";
import Modal from "./Modal";

export function ClearChatModal() {
  return (
    <Modal
      heading="Are you sure you want to clear your chat?"
      confirm={{ text: "Yes, clear chat", action: confirmClearChat }}
      closeText="Return to chat"
      type="danger"
    />
  );
}

export function ReturnHomeModal() {
  const router = useRouter();

  const returnHome = () => {
    clearHistory();
    router.push("/");
  };

  return (
    <Modal
      heading="If you return home, your chat will be cleared and any responses will be lost"
      confirm={{
        text: "Continue to home",
        action: returnHome,
      }}
      closeText="Return to chat"
      type="danger"
    />
  );
}
