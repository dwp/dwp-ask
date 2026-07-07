"use client";

import { forwardRef } from "react";
import type { BackLinkProps } from "@/types";
import styles from "./BackLink.module.css";

const BackLink = forwardRef<HTMLAnchorElement, BackLinkProps>(
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
