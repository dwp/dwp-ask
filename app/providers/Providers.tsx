"use client";

import CitationsProvider from "./CitationsProvider";
import LocationProvider from "./LocationProvider";
import { ModalProvider } from "./ModalProvider";
import { ResponsiveProvider } from "./ResponsiveProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

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
