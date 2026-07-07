"use client";

import { MOBILE_BREAKPOINT } from "@/constants/Layout";
import { useModal } from "@/providers";
import type { CardProps } from "@/types";
import styles from "./Card.module.css";

export default function Card({
  text,
  onClick,
  className,
  dataTestId = "card-text",
  disabled = false,
}: CardProps) {
  const { isModalVisible } = useModal();
  const isModalOpen = Object.values(isModalVisible).includes(true);

  return (
    <button
      className={className ?? styles.exampleCard}
      data-testid={dataTestId}
      aria-label={text}
      onClick={() => onClick(text)}
      disabled={disabled}
      tabIndex={isModalOpen || window.innerWidth <= MOBILE_BREAKPOINT ? -1 : 0}
    >
      {text}
    </button>
  );
}
