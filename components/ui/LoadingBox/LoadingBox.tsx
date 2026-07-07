import type * as React from "react";
import { Spinner } from "@/components";
import { GDS_COLOURS } from "@/constants/Colours";
import type { LoadingBoxProps } from "@/types";
import styles from "./LoadingBox.module.css";

const LoadingBox: React.FC<LoadingBoxProps> = ({
  children,
  backgroundColor = GDS_COLOURS.WHITE,
  backgroundColorOpacity = 0.85,
  loading = false,
  spinnerColor = GDS_COLOURS.BLACK,
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
