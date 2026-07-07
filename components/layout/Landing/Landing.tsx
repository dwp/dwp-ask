"use client";

import { useRouter } from "next/navigation";
import {
  AINotice,
  Analytics,
  Button,
  Main,
  SectionBreak,
  Title,
} from "@/components";
import { useLocation } from "@/providers";
import { clearHistory } from "@/utils";
import styles from "./Landing.module.css";

export default function Landing() {
  const router = useRouter();
  const { setLocation } = useLocation();

  /**
   * Start a chat by initiating a session and route pushed to /chat
   *
   * @returns void
   */
  const startChat = () => {
    clearHistory();
    setLocation(null);
    router.push("/chat");
  };

  return (
    <Main>
      <Analytics />
      <div className={styles.login} data-testid="landing-container">
        <Title level="h1" data-testid="landing-heading">
          Using AI Responsibly
        </Title>
        <SectionBreak level="m" visible={false} />
        <AINotice />
        <SectionBreak level="m" visible={false} />

        <Button
          data-testid="landing-start-chat-button"
          aria-label="Agree and continue"
          start
          onClick={startChat}
        >
          Agree and Continue
        </Button>
      </div>
    </Main>
  );
}
