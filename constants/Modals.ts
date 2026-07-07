import type { ModalConstantsType } from "@/types";
import { confirmClearChat } from "@/utils";

const MODALS: ModalConstantsType = {
  newChat: {
    heading:
      "Are you sure you want to start a new chat? This will clear your current chat.",
    closeText: "Return to chat",
    type: "danger",
    confirm: { text: "Yes, clear chat", action: confirmClearChat },
  },
  returnHome: {
    heading:
      "If you return home, your chat will be cleared and any responses will be lost",
    closeText: "Return to chat",
    type: "danger",
    confirm: { text: "Continue to home" },
  },
};

export { MODALS };
