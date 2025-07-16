"use client";
import type { FC } from "react";
import cn from "classnames";

import styles from "./Button.module.css";
import Image from "next/image";

interface ButtonProps {
  content: string;
  className: string;
  icon?: string;
  isActive?: boolean;
  handleClick: () => void;
}

export const Button: FC<ButtonProps> = ({
  content,
  className,
  isActive,
  icon,
  handleClick,
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      className={cn(styles.button, styles[className], {
        [styles.active]: isActive,
      })}
    >
      {icon && <Image width={10} height={10} src={icon} alt="" />}
      {content}
    </button>
  );
};
