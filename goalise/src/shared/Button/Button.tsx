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
  leftIcon?:StaticImageData;
  iconHeight?: number;
  iconWidth?: number;
  isActive?: boolean;
  handleClick: () => void;
}

export const Button: FC<ButtonProps> = ({
  content,
  iconWidth,
  iconHeight,
  className,
  isActive,
  icon,
  leftIcon,
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
      {icon && <div className={styles.icon}> <Image width={iconWidth} height={iconHeight} src={icon} alt=""  className={styles.icon}/></div> }
      {<div className={styles.content}> {content} </div>}
      {leftIcon && <div className={styles.leftIconWrapper}><Image width={iconWidth} height={iconHeight} src={leftIcon} alt=""  className={styles.leftIcon} /></div>}
    </button>
  );
};
