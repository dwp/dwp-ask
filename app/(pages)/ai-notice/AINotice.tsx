"use client";

import { useRouter } from "next/navigation";
import {
  SectionBreak,
  BackLink,
  Heading,
  Main,
  Analytics,
  Paragraph,
} from "@/app/components";
import { AINoticeList } from "@/app/content/AINotice";

export default function AINotice() {
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
      <Heading data-testid="ai-notice-heading">AI notice</Heading>
      {AINoticeList.map((item, index) => (
        <Paragraph
          key={`ai-notice-list-item-${index + 1}`}
          data-testid={`ai-notice-list-item-${index + 1}`}
        >
          {item}
        </Paragraph>
      ))}
    </Main>
  );
}
