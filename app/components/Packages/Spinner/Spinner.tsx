import * as React from "react";
import styles from "./Spinner.module.css";

interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  fill?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  className = "icon-spinner",
  fill = "currentColor",
  ...rest
}) => (
  <svg
    className={`${styles.spinner} ${className}`}
    viewBox="-25 -25 50 50"
    preserveAspectRatio="xMidYMid meet"
    fill={fill}
    {...rest}
  >
    {Array(12)
      .fill(1)
      .map((_, i) => (
        <rect
          key={i}
          className={styles.rect}
          fill={fill}
          width="12"
          height="5"
          rx="2.5"
          ry="2.5"
          style={{ animationDelay: `${i * 83}ms` }}
          transform={`rotate(${i * 30}, 0, 2) translate(10 0)`}
          opacity="0"
        />
      ))}
  </svg>
);

export default Spinner;
