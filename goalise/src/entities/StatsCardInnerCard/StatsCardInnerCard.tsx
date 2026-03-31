import React from "react";
import { IStatsCardInnerCardProps } from "./StatsCardInnerCard.types";
import styles from "./StatsCardInnerCard.module.css";
import Image from "next/image";
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import profilePicturePlaceholder from "@/assets/pngs/profilePictureIcon.svg";

export const StatsCardInnerCard: React.FC<IStatsCardInnerCardProps> = ({
    playerId,
    teamPlayer,
    team,
    value,
}) => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;

    const playerImage =
        teamPlayer.picture && teamPlayer.picture.startsWith("http")
            ? teamPlayer.picture
            : profilePicturePlaceholder;

    const inner = (
        <div className={styles.wrapper}>
            <div className={styles.imageNameWrapper}>
                <Image
                    src={playerImage}
                    alt={`${teamPlayer.firstName} ${teamPlayer.lastName}`}
                    width={40}
                    height={40}
                    className={styles.playerImage}
                    unoptimized
                />
                <div className={styles.nameContainer}>
                    <div className={styles.playerName}>
                        {teamPlayer.firstName} {teamPlayer.lastName}{" "}
                    </div>
                    <div className={styles.teamName}> {team?.name}</div>
                </div>
            </div>
            <div className={styles.shirtNumber}> #{teamPlayer.shirtNumber} </div>
            <div className={`${styles.value} ${styles.topValue}`}> {value} </div>
        </div>
    );

    return (
        <div className={`${isMobile ? styles.mobileWrapper : styles.container}`}>
            {playerId ? (
                <Link href={`/profile/${playerId}`} className={styles.rowLink}>
                    {inner}
                </Link>
            ) : (
                inner
            )}
        </div>
    );
};