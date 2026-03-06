"use client";

import { useRouter } from "next/navigation";
import {
  AINotice,
  Analytics,
  Button,
  H1,
  Main,
  SectionBreak,
} from "@/app/components";
import { useLocation } from "@/app/providers";
import { clearHistory } from "@/app/utils";
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
    setLocation("");
    router.push("/chat");
  };

  return (
    <Main>
      <Analytics />
      <div className={styles.login} data-testid="landing-container">
        <H1 data-testid="landing-heading">Using AI Responsibly</H1>
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
