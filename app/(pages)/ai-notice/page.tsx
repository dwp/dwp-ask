import { AINoticeMetadata } from "@/app/constants/PageMetadata";
import AINoticePage from "./AINoticePage";

export const metadata = AINoticeMetadata;

export default function AINoticeWrapper() {
  return <AINoticePage />;
}
