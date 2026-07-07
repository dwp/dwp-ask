"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/components";
import { useModal } from "@/providers";
import type { ChangeClaimantLocationProps } from "@/types";

/**
 * Link that opens the "clear chat" modal to allow the user to change
 * their claimant's country. Only visible on the /chat page.
 */
export default function ChangeClaimantLocation({
  className,
}: ChangeClaimantLocationProps) {
  const { setModalVisible } = useModal();
  const pathname = usePathname();

  if (pathname !== "/chat") {
    return null;
  }

  return (
    <Link
      role="menuitem"
      className={className}
      data-testid="change-claimant-location-link"
      onClick={() => setModalVisible("newChat")}
    >
      Change claimant country
    </Link>
  );
}
