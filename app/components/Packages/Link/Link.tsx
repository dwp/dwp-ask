"use client";

import NextLink from "next/link";
import {
  type FocusEvent,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from "react";
import styles from "./Link.module.css";

type CommonProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (
    event: KeyboardEvent<HTMLAnchorElement> | KeyboardEvent<HTMLButtonElement>,
  ) => void;
  onBlur?: (event: FocusEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  onFocus?: (event: FocusEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-hidden"?: boolean;
  "data-testid"?: string;
};

type AnchorProps = CommonProps & {
  href: string;
  target?: string;
  onClick?: (
    event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
  ) => void;
};

type ButtonProps = CommonProps & {
  href?: undefined;
  onClick: (
    event:
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
      | KeyboardEvent<HTMLButtonElement>,
  ) => void;
  target?: undefined;
};

type LinkType = AnchorProps | ButtonProps;

const Link = forwardRef<HTMLAnchorElement | HTMLButtonElement, LinkType>(
  (props, ref) => {
    const {
      children,
      id,
      className,
      role,
      tabIndex,
      onKeyDown,
      onBlur,
      onFocus,
      "aria-label": ariaLabel,
      "aria-hidden": ariaHidden,
      "data-testid": dataTest,
    } = props;

    if ("onClick" in props && !("href" in props)) {
      // Button variant
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          onClick={props.onClick}
          id={id}
          className={`${className ?? ""} ${styles.link_button}`}
          role={role ?? "button"}
          tabIndex={tabIndex}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          onFocus={onFocus}
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

    // Anchor variant
    const { href, target, onClick } = props as AnchorProps;
    return (
      <NextLink
        ref={ref as Ref<HTMLAnchorElement>}
        onClick={onClick}
        href={href}
        target={target}
        id={id}
        className={`govuk-link ${className ?? ""} ${styles.link_underline}`}
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
        onBlur={onBlur}
        onFocus={onFocus}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        data-testid={dataTest}
      >
        {children}
      </NextLink>
    );
  },
);

Link.displayName = "Link";

export default Link;
