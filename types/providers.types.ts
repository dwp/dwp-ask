import type React from "react";
import type { ChatHistoryType, LocationType } from "./chat.types";

export type LocationContextType = {
  location: LocationType;
  setLocation: (location: LocationType) => void;
};

export type ResponsiveContextType = {
  isSmallScreen: boolean;
  width: number;
  height: number;
};

export type IsModalVisibleType = {
  newChat: boolean;
  returnHome: boolean;
};

export type ModalContextType = {
  isModalVisible: IsModalVisibleType;
  setModalVisible: (modal: keyof IsModalVisibleType) => void;
  resetModals: () => void;
};

export type CitationsContextType = {
  citations: ChatHistoryType["citations"];
  setCitations: (citations: ChatHistoryType["citations"]) => void;
};

export type ProvidersProps = {
  children: React.ReactNode;
};
