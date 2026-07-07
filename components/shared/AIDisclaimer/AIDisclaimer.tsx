import type { AIDisclaimerProps } from "@/types";
import styles from "./AIDisclaimer.module.css";

/** Displays an AI disclaimer warning users to verify answers against source documents. */
export default function AIDisclaimer({ showAIStatement }: AIDisclaimerProps) {
  if (!showAIStatement) return null;

  return (
    <div className={styles.ai_disclaimer_span}>
      <strong
        className={styles.ai_disclaimer}
        data-testid="ai-answer-disclaimer"
      >
        This AI summary may contain errors.{"\n"}
      </strong>
      <strong
        className={styles.ai_disclaimer}
        data-testid="ai-answer-disclaimer"
      >
        Use the Universal Learning guidance links below to check the answer. All
        links open in a new tab.
      </strong>
    </div>
  );
}
