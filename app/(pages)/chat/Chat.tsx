import { Analytics } from "../../components";
import styles from "./Chat.module.css";
import ChatWindow from "./chat-helpers/ChatWindow";

export default async function Chat() {
  return (
    <div className={styles.chatWrapper}>
      <Analytics />

      <div className={styles.chatWindow}>
        <ChatWindow />
      </div>
    </div>
  );
}
