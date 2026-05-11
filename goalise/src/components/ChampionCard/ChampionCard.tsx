"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import championIcon from '../../assets/pngs/championIcon.svg';
import styles from "./ChampionCard.module.css";
import { useTranslations } from "next-intl";

interface ChampionCardProps {
  type?: "default" | "draw";
  teamName?: string;
  logoSrc?: string;
  teamId?: number;
}

export const ChampionCard: React.FC<ChampionCardProps> = ({
  type = "default",
  teamName,
  logoSrc,
  teamId,
}) => {
  const t = useTranslations("champion");
  const card = (
    <div className={`${styles.card} ${type === "draw" ? styles.drawType : ""}`}>
      <div className={styles.badge}><span>{t("badge")} </span></div>
      <div className={styles.content}>
        {logoSrc &&
          <div className={styles.logo}>
            <Image src={logoSrc} alt="" width={80} height={80} />
          </div>
        }
        <div className={styles.teamName}>{teamName}</div>
        {type === "draw" && <Image src={championIcon} alt="Champion" className={styles.championIcon} />}
      </div>
    </div>
  );

  if (teamId) {
    return (
      <Link href={`/teams/${teamId}`} className={styles.cardLink}>
        {card}
      </Link>
    );
  }

  return card;
};
