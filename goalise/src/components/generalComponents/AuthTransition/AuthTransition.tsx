"use client";

import Image from "next/image";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import logo from "../../../../public/pngs/logo/Logo.svg";
import styles from "./AuthTransition.module.css";

type AuthTransitionProps = {
  title: string;
  description: ReactNode;
  variant?: "loading" | "error";
  backHref?: string;
  backText?: string;
};

export const AuthTransition: FC<AuthTransitionProps> = ({
  title,
  description,
  variant = "loading",
  backHref,
  backText,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.card} role="status" aria-live="polite">
        <Image src={logo} alt="Goalize" className={styles.logo} priority />
        {variant === "loading" ? (
          <div className={styles.spinner} aria-hidden="true" />
        ) : (
          <div className={styles.iconWrap} aria-hidden="true">!</div>
        )}
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
        {variant === "error" && backHref && backText && (
          <div className={styles.actions}>
            <Link href={backHref} className={styles.primaryLink}>
              {backText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
