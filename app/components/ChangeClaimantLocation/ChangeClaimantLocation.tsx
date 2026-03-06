"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/app/components";
import { useModal } from "@/app/providers";

type ChangeClaimantLocationProps = { className?: string };

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
      onClick={() => setModalVisible("clearChat")}
    >
      Change claimant country
    </Link>
  );
}
