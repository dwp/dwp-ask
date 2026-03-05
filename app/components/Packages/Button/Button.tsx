import * as React from "react";
import styles from "./Button.module.css";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  start?: boolean;
  buttonColour?: string;
  buttonHoverColour?: string;
  buttonShadowColour?: string;
  buttonTextColour?: string;
  "data-testid"?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      start = false,
      children,
      icon,
      buttonColour,
      buttonHoverColour,
      buttonShadowColour,
      buttonTextColour,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const customStyle = {
      "--button-colour": buttonColour,
      "--button-hover-colour": buttonHoverColour,
      "--button-shadow-colour": buttonShadowColour,
      "--button-text-colour": buttonTextColour,
      ...style,
    } as React.CSSProperties;

    const buttonClass = [
      styles.button,
      start && styles.start,
      icon && styles.withIcon,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const dataTestId = props["data-testid"] || "button";

    return (
      <button
        data-testid={dataTestId}
        ref={ref}
        className={buttonClass}
        style={customStyle}
        {...props}
      >
        {icon ? (
          <>
            <span className={styles.contents}>{children}</span>
            {icon}
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
