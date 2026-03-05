import Analytics from "@/app/components/Analytics/Analytics";
import ChatWindowVersionB from "./ChatWindowVersionB";
import styles from "./ChatVersionB.module.css";
import SidebarWrapper from "@/app/components/Packages/Sidebar/SidebarWrapper";

export default function ChatVersionB() {
  return (
    <div className={styles.chatWrapper} id="main">
      <Analytics />

      <div className={styles.chatWindow}>
        <ChatWindowVersionB />
      </div>

      <SidebarWrapper />
    </div>
  );
}
