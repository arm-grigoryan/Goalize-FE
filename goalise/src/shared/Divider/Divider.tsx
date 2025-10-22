import styles from "./Divider.module.css";
import type { FC } from "react";
import { Divider } from "@mui/material";

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
      className={styles.divider}
      variant={variant}
      orientation={orientation}
      flexItem={flexItem}
    />
  );
};

export default CustomDivider;
