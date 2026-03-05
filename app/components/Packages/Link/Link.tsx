"use client";

import NextLink from "next/link";
import styles from "./Link.module.css";

type LinkType = Readonly<{
  children: React.ReactNode;
  href?: string;
  target?: string;
  id?: string;
  className?: string;
  role?: string;
  tabIndex?: number;
  onClick?: (
    event:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onKeyDown?: (
    event:
      | React.KeyboardEvent<HTMLAnchorElement>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onBlur?: (
    event: React.FocusEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
  onFocus?: (
    event: React.FocusEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) => void;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  "data-testid"?: string;
}>;

export default function Link({
  children,
  href,
  target,
  id,
  className,
  role,
  tabIndex,
  onKeyDown,
  onClick,
  ...props
}: LinkType) {
  const ariaLabel = props["aria-label"];
  const ariaHidden = props["aria-hidden"];
  const dataTest = props["data-testid"];

  // If onClick is provided but no href, render as button to prevent navigation
  if (onClick && !href) {
    return (
      <button
        type="button"
        onClick={(e) => onClick(e)}
        id={id}
        className={`${className} ${styles.link_button}`}
        role={role ?? "button"}
        tabIndex={tabIndex}
        onKeyDown={onKeyDown}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        data-testid={dataTest}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: "19px",
          color: "#1d70b8",
        }}
      >
        {children}
      </button>
    );
  }

  return (
    <NextLink
      onClick={onClick}
      href={href ?? ""}
      target={target}
      id={id}
      className={`govuk-link ${className} ${styles.link_underline}`}
      role={role ?? "link"}
      tabIndex={tabIndex}
      onKeyDown={(e) => {
        if (onKeyDown) {
          onKeyDown(e);
          return;
        }
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          onClick(e as any);
        }
      }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      data-testid={dataTest}
    >
      {children}
    </NextLink>
  );
}
