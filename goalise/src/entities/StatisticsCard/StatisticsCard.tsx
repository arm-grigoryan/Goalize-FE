import React from "react";
import styles from './StatisticsCard.module.css'
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export interface IStatisticsCardProps {
    title?: string;
    progressLeft?: number;
    progressRight?: number;
    leftVariant?: "blue" | "red";
    rightVariant?: "blue" | "red";
}
export const StatisticsCard: React.FC<IStatisticsCardProps> = ({
    title,
    progressLeft = 0,
    progressRight = 0,
    leftVariant = "blue",
    rightVariant = "blue"
}) => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    const leftClass =
        leftVariant === "red"
            ? `${styles.progressFillLeft} ${styles.red}`
            : styles.progressFillLeft;

    const rightClass =
        rightVariant === "red"
            ? `${styles.progressFill} ${styles.red}`
            : styles.progressFill;

    return (
        <div className={`${styles.wrapper} ${isMobile ? styles.mobile : ''}`}>
            <div className={styles.title}>{title}</div>

            <div className={styles.container}>
                <div
                    className={styles.progressContainer}
                    style={{ width: `${progressLeft}%` }}
                >
                    <div className={leftClass}>
                        <span className={styles.progressTextLeft}>
                            {progressLeft}
                        </span>
                    </div>
                </div>

                <div
                    className={styles.progressContainer}
                    style={{ width: `${progressRight}%` }}
                >
                    <div className={rightClass}>
                        <span className={styles.progressText}>
                            {progressRight}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};