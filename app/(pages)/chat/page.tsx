import { ChatMetadata } from "@/app/constants/PageMetadata";
import Chat from "./Chat";

export const dynamic = "force-dynamic";
export const metadata = ChatMetadata;

export default function ChatPage() {
  return <Chat />;
}
