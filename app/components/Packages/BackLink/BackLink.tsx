"use client";

import React from "react";
import styles from "./BackLink.module.css";

interface BackLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  "data-testid"?: string;
  "aria-label"?: string;
  role?: string;
  tabIndex?: number;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

const BackLink = React.forwardRef<HTMLAnchorElement, BackLinkProps>(
  (
    {
      tabIndex,
      onClick,
      className,
      children = "Back",
      role = "link",
      href,
      ...props
    },
    ref,
  ) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (onClick && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        onClick(e);
      }
    };

    const combinedClassName = [styles.backLink, className]
      .filter(Boolean)
      .join(" ");

    return (
      <a
        ref={ref}
        href={href}
        className={combinedClassName}
        tabIndex={tabIndex ?? 0}
        onClick={onClick}
        role={role}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </a>
    );
  },
);

BackLink.displayName = "BackLink";

export default BackLink;
