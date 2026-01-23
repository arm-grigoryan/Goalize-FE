import Image from "next/image";
import ball from "../assets/pngs/ballIcon.svg";
import styles from "./not-found.module.css";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
     const t = useTranslations()
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span className={styles.number} data-text="4">4</span>
          <div className={styles.ball_container}> 
            <Image
                src={ball}
                alt="404 ball"
                className={styles.ball}
            />
            </div> 
        <span className={styles.number} data-text="4">4</span>
      </div>
      <div className={styles.message}> {t("errors.notFound")}</div>
      <div className={styles.link}> <Link href="/">{t("errors.backButtonText")}</Link></div>
    </div>
  );
}
