import * as React from "react";
import Spinner from "../Spinner/Spinner";
import styles from "./LoadingBox.module.css";

export interface LoadingBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spinnerColor?: string;
  backgroundColor?: string;
  backgroundColorOpacity?: number;
  loading?: boolean;
  timeIn?: number;
  timeOut?: number;
}

const LoadingBox: React.FC<LoadingBoxProps> = ({
  children,
  backgroundColor = "#ffffff",
  backgroundColorOpacity = 0.85,
  loading = false,
  spinnerColor = "#0b0c0c",
  timeIn = 800,
  timeOut = 200,
  ...props
}) => {
  const overlayStyle = {
    "--bg-color": backgroundColor,
    "--bg-opacity": backgroundColorOpacity,
    "--time-in": `${timeIn}ms`,
    "--time-out": `${timeOut}ms`,
  } as React.CSSProperties;

  return (
    <div className={styles.container} {...props}>
      {loading && (
        <div className={styles.innerWrap} style={overlayStyle}>
          <Spinner
            className={styles.spinner}
            fill={spinnerColor}
            width="50px"
            height="50px"
          />
          <div className={styles.overlay} />
        </div>
      )}
      {children}
    </div>
  );
};

LoadingBox.displayName = "LoadingBox";

export default LoadingBox;
