"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SidebarContextType = {
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  showSidebar: () => void;
  hideSidebar: () => void;
  setSidebarVisible: (v: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);

  const toggleSidebar = () => setIsSidebarVisible((v) => !v);
  const showSidebar = () => setIsSidebarVisible(true);
  const hideSidebar = () => setIsSidebarVisible(false);

  return (
    <SidebarContext.Provider
      value={{
        isSidebarVisible,
        toggleSidebar,
        showSidebar,
        hideSidebar,
        setSidebarVisible: setIsSidebarVisible,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return ctx;
};

export default SidebarProvider;
