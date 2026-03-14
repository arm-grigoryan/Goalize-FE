import React from "react";
import styles from './StatisticsCard.module.css'

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

    const leftClass =
        leftVariant === "red"
            ? `${styles.progressFillLeft} ${styles.red}`
            : styles.progressFillLeft;

    const rightClass =
        rightVariant === "red"
            ? `${styles.progressFill} ${styles.red}`
            : styles.progressFill;

    return (
        <div className={styles.wrapper}>
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