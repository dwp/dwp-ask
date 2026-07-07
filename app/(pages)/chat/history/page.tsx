import { ChatHistoryMetadata } from "@/constants/PageMetadata";
import ChatHistory from "./ChatHistory";

export const metadata = ChatHistoryMetadata;

export default function ChatHistoryPage() {
  return <ChatHistory />;
}
