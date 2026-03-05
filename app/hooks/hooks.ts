"use client";

import { useEffect, useState } from "react";

export const useDomLoaded = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const onDomContentLoaded = () => setIsLoaded(true);
    if (typeof document !== "undefined") {
      if (
        document.readyState === "interactive" ||
        document.readyState === "complete"
      ) {
        setIsLoaded(true);
      } else {
        document.addEventListener("DOMContentLoaded", onDomContentLoaded);
        return () => {
          document.removeEventListener("DOMContentLoaded", onDomContentLoaded);
        };
      }
    }
  }, []);
  return isLoaded;
};
