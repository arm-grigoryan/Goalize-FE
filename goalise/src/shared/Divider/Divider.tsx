import styles from "./Divider.module.css";
import type { FC } from "react";

interface DividerProps {
  className: string;
}
export const Divider: FC<DividerProps> = ({ className }) => {
  return <div className={styles[className]}></div>;
};
