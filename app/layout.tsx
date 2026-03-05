import type { Metadata } from "next";
import Script from "next/script";
import { SkipLink, Layout } from "./components";
import Providers from "./providers/Providers";
import "./globals.css";
import "./index.scss";

export const metadata: Metadata = {
  title: "DWP Ask",
  description: "DWP Ask",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="govuk-template__body govuk-frontend-supported">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-53V37X4L"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Providers>
          <SkipLink />
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
