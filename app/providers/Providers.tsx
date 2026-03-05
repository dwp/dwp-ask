"use client";

import { ResponsiveProvider } from "./ResponsiveProvider";
import { ModalProvider } from "./ModalProvider";
import LocationProvider from "./LocationProvider";
import CitationsProvider from "./CitationsProvider";
import SidebarProvider from "./SidebarProvider";

type ProvidersProps = {
  children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <ResponsiveProvider>
      <ModalProvider>
        <LocationProvider>
          <SidebarProvider>
            <CitationsProvider>{children}</CitationsProvider>
          </SidebarProvider>
        </LocationProvider>
      </ModalProvider>
    </ResponsiveProvider>
  );
}
