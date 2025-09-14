import type { FC } from "react";

import cn from "classnames";

import styles from "./Title.module.css";

interface TitleProps {
  content: string;
  className?: string;
  font?: string;
  isH1?: boolean;
}

export const Title: FC<TitleProps> = ({ content, font, className, isH1 }) => {
  if (isH1)
    return (
      <h1 className={cn(styles.title, styles[className ?? ""], font)}>
        {content}
      </h1>
    );
  return (
    <h2 className={cn(styles.title, styles[className ?? ""], font)}>
      {content}
    </h2>
  );
};
