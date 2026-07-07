"use client";

import type { ProvidersProps } from "@/types";
import CitationsProvider from "./CitationsProvider";
import LocationProvider from "./LocationProvider";
import { ModalProvider } from "./ModalProvider";
import { ResponsiveProvider } from "./ResponsiveProvider";

/**
 * Composes all application-level context providers into a single wrapper.
 * Order: Responsive → Modal → Location → Citations (outermost → innermost).
 */
export default function Providers({ children }: ProvidersProps) {
  return (
    <ResponsiveProvider>
      <ModalProvider>
        <LocationProvider>
          <CitationsProvider>{children}</CitationsProvider>
        </LocationProvider>
      </ModalProvider>
    </ResponsiveProvider>
  );
}
