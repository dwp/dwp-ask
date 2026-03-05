import ChatVersionB from "./ChatVersionB";
import { ChatMetadata } from "@/app/constants/PageMetadata";

export const dynamic = "force-dynamic";
export const metadata = ChatMetadata;

export default function ChatPage() {
  return <ChatVersionB />;
}
