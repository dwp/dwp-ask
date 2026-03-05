import { Analytics } from "../../components";
import ChatWindow from "./chat-helpers/ChatWindow";
import styles from "./Chat.module.css";

export default async function Chat() {
  return (
    <div className={styles.chatWrapper} id="main">
      <Analytics />

      <div className={styles.chatWindow}>
        <ChatWindow />
      </div>
    </div>
  );
}
