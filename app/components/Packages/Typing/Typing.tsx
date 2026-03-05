import styles from "./Typing.module.css";

export default function Typing() {
  return (
    <div className={styles.typingContainer} data-testid="typing-container">
      <div className={styles.typingDot}></div>
      <div className={styles.typingDot}></div>
      <div className={styles.typingDot}></div>
      <span className={styles.typingText} data-testid="typing-text">
        Using AI to search Universal Learning for guidance
      </span>
    </div>
  );
}
