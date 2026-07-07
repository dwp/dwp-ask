"use client";

import { useRouter } from "next/navigation";
import {
  AINotice,
  Analytics,
  BackLink,
  Main,
  SectionBreak,
  Title,
} from "@/components";

export default function AINoticePage() {
  const router = useRouter();
  return (
    <Main>
      <Analytics />
      <BackLink
        data-testid="ai-notice-home-link"
        aria-label="Back"
        tabIndex={0}
        onClick={() => router.push("/chat")}
      >
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>
          Back
        </span>
      </BackLink>
      <SectionBreak visible={false} level="m" aria-hidden />
      <Title level="h1" data-testid="ai-notice-heading">
        Using AI Responsibly
      </Title>
      <AINotice />
    </Main>
  );
}
