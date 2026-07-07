"use client";
import type React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { MOBILE_BREAKPOINT } from "@/constants/Layout";
import type { ResponsiveContextType } from "@/types";

/** Context for sharing responsive viewport information. */
const ResponsiveContext = createContext<ResponsiveContextType | undefined>(
  undefined,
);

/**
 * Provides responsive viewport state (width, height, isSmallScreen) to child components.
 * Listens to window resize and matchMedia events to stay in sync.
 */
export const ResponsiveProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });

    // set initial
    update();

    const m = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onMedia = () => update();

    // Listen to both resize and matchMedia changes
    window.addEventListener("resize", update);
    m.addEventListener?.("change", onMedia);

    return () => {
      window.removeEventListener("resize", update);
      m.removeEventListener?.("change", onMedia);
    };
  }, []);

  const isSmallScreen =
    size.width > 0 ? size.width <= MOBILE_BREAKPOINT : false;

  const value = useMemo(
    () => ({ isSmallScreen, width: size.width, height: size.height }),
    [isSmallScreen, size.width, size.height],
  );

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};

/**
 * Hook to access the responsive context.
 *
 * @returns isSmallScreen boolean, width, and height
 * @throws Error if used outside of ResponsiveProvider
 */
export const useResponsive = () => {
  const ctx = useContext(ResponsiveContext);
  if (!ctx)
    throw new Error("useResponsive must be used within ResponsiveProvider");
  return ctx;
};
