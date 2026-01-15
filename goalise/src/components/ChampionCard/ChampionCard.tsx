import React from "react";
import Image from "next/image";
import styles from "./ChampionCard.module.css";

interface ChampionCardProps {
  teamName?: string;
  logoSrc?: string;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({
  teamName,
  logoSrc,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.badge}>CHAMPION</div>
      <div className={styles.content}>
        <div className={styles.logo}>
         { logoSrc && <Image src={logoSrc} alt="" width={80} height={80} />}
        </div>
        <div className={styles.teamName}>{teamName}</div>
      </div>
    </div>
  );
};
