import styles from "./Divider.module.css";
import type { FC } from "react";
import { Divider } from "@mui/material";
import clsx from "clsx";

interface CustomDividerProps {
  variant?: "middle" | "fullWidth" | "inset";
  orientation?: "horizontal" | "vertical";
  flexItem?: boolean;
}

export const CustomDivider: FC<CustomDividerProps> = ({
  variant,
  orientation,
  flexItem,
}) => {
  return (
    <Divider
      className={clsx(
        styles.divider,
        orientation === "vertical" && styles["divider-vertical"]
      )}
      variant={variant}
      orientation={orientation}
      flexItem={flexItem}
    />
  );
};

