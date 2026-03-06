"use client";

import { useModal } from "@/app/providers";
import styles from "./Card.module.css";

type CardProps = {
  text: string;
  onClick: (text: string) => void;
  className?: string;
  dataTestId?: string;
  disabled?: boolean;
};

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
      tabIndex={isModalOpen || window.innerWidth <= 768 ? -1 : 0}
    >
      {text}
    </button>
  );
}
