"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ResponsiveContextType = {
  isSmallScreen: boolean;
  width: number;
  height: number;
};

const ResponsiveContext = createContext<ResponsiveContextType | undefined>(
  undefined,
);

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

    const m = window.matchMedia("(max-width: 768px)");
    const onMedia = () => update();

    // Listen to both resize and matchMedia changes
    window.addEventListener("resize", update);
    m.addEventListener?.("change", onMedia);

    return () => {
      window.removeEventListener("resize", update);
      m.removeEventListener?.("change", onMedia);
    };
  }, []);

  const isSmallScreen = size.width > 0 ? size.width <= 768 : false;

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

export const useResponsive = () => {
  const ctx = useContext(ResponsiveContext);
  if (!ctx)
    throw new Error("useResponsive must be used within ResponsiveProvider");
  return ctx;
};
