import React from "react";
import Image from "next/image";
import championIcon from '../../assets/pngs/championIcon.svg';
import styles from "./ChampionCard.module.css";

interface ChampionCardProps {
  type?: "default" | "draw";
  teamName?: string;
  logoSrc?: string;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({
  type = "default",
  teamName,
  logoSrc,
}) => {
  return (
    <div className={` ${styles.card} ${
      type === "draw" ? styles.drawType : ""
    }`}>
      <div className={styles.badge}><span>CHAMPION </span></div>
      <div className={styles.content}>
        { logoSrc && 
            <div className={styles.logo}>
            <Image src={logoSrc} alt="" width={80} height={80} />
            </div>
          }
        <div className={styles.teamName}>{teamName}</div>
        {type === "draw" &&<Image src={championIcon} alt="Champion" className={styles.championIcon}/>}
      </div>
    </div>
  );
};
