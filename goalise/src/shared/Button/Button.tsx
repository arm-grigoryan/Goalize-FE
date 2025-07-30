"use client";
import type { FC } from "react";
import cn from "classnames";
import type { StaticImageData } from "next/image";
import styles from "./Button.module.css";
import Image from "next/image";

interface ButtonProps {
  className: string;
  content?: string;
  icon?: StaticImageData;
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
      {icon && <Image width={15} height={15} src={icon} alt="" />}
      {content}
    </button>
  );
};
