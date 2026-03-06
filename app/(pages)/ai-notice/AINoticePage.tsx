"use client";

import { useRouter } from "next/navigation";
import {
  AINotice,
  Analytics,
  BackLink,
  Heading,
  Main,
  SectionBreak,
} from "@/app/components";

export default function AINoticePage() {
  const router = useRouter();
  return (
    <Main>
      <Analytics />
      <BackLink
        data-testid="ai-notice-home-link"
        aria-label="Home"
        tabIndex={0}
        onClick={() => router.push("/")}
      >
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>
          Home
        </span>
      </BackLink>
      <SectionBreak visible={false} level="m" aria-hidden />
      <Heading data-testid="ai-notice-heading">Using AI Responsibly</Heading>
      <AINotice />
    </Main>
  );
}
