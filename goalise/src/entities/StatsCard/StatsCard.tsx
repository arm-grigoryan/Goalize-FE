import React from "react";
import { IStatsCardProps } from "./StatsCard.types";
import styles from "./StatsCard.module.css";
import StatsCardInnerCard from "../StatsCardInnerCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const StatsCard: React.FC<IStatsCardProps> = ({
  title,
  object,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    <div className={`${isMobile ? styles.mobileWrapper : styles.container}`}>
      <div className={styles.title}>{title}</div>

      <div className={styles.cardContainer}>
        {object.map((obj, index) => (
          <StatsCardInnerCard key={index} {...obj} />
        ))}
      </div>
    </div>
  );
};
