import React from "react";
import styles from "./ErrorBanner.module.css";
import Image from "next/image";
import errorIcon from "../../assets/pngs/error.svg";
import { useTranslations } from "next-intl";
interface ErrorBannerProps {
  message?: string;
  visible: boolean;
  onClose?: () => void;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, visible, onClose }) => {
  const t = useTranslations();
  if (!visible) return null;
  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}> 
        <Image src={errorIcon} alt="" className={styles.icon}/>
        <div className={styles.message}> {message || t("errors.networkError")} </div>
      </div>
      {onClose && (
        <button 
          className={styles.closeButton}
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  );
};
