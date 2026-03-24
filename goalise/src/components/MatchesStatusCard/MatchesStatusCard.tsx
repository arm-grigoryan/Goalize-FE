import React from "react";
import styles from './MatchesStatusCard.module.css'
import Image from "next/image";
import Link from "next/link";
import Button from "@/shared/Button";
import teamLogo from '../../assets/pngs/teamLogo.png';
import { useTranslations } from "next-intl";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export interface IMatchesStatusCardProps {
    playerName?: string;
    playerPicture?: string;
    playerId?: number;
    rating?: number;
    goals?: number;
    assists?: number;
    tackles?: number;
    interceptions?: number;
    passes?: number;
    shots?: number;
    goalKeeperRating?: number;
    saves?: number;
    goalsConceded?: number;
    penaltiesSaved?: number;
    onClose?: () => void;
}
export const MatchesStatusCard: React.FC<IMatchesStatusCardProps> = ({
    playerName,
    playerPicture,
    playerId,
    rating,
    goals,
    assists,
    tackles,
    interceptions,
    passes,
    shots,
    goalKeeperRating,
    saves,
    goalsConceded,
    penaltiesSaved,
    onClose,
}) => {
      const { width } = useWindowSize();
      const isMobile = width <= MEDIA_TABLET_SMALL;
    const t = useTranslations();
    return <div className={`${styles.overlay} ${isMobile ? styles.mobile : ''}`}>
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.infoWrapper}>
                    <div className={styles.imagesWrapper}>
                        {playerPicture
                            ? <Image src={playerPicture} alt="" width={74} height={74} className={styles.playerImage}/>
                            : <Image src={teamLogo} alt="" className={styles.playerImage}/>
                        }
                    </div>
                    <div className={styles.playerName}>{playerName}</div>
                </div>
                <div className={styles.statsContainer}>
                    <div className={styles.title}>{t("matches.statusCard.playerStats.title")}</div>
                    <div className={styles.wrapper}>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.playerStats.rating")}</span>
                            <div>{rating}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.playerStats.goals")}</span>
                            <div>{goals}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.playerStats.assists")}</span>
                            <div>{assists}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.playerStats.tackles")}</span>
                            <div>{tackles}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.playerStats.interceptions")}</span>
                            <div>{interceptions}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.playerStats.passes")}</span>
                            <div>{passes}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.playerStats.shots")}</span>
                            <div>{shots}</div>
                        </div>
                    </div>

                    <div className={styles.title}> {t("matches.statusCard.goalkeeperStats.title")}</div>
                     <div className={styles.wrapper}>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.goalkeeperStats.rating")}</span>
                            <div>{goalKeeperRating}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.goalkeeperStats.saves")}</span>
                            <div>{saves}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.goalkeeperStats.goalsConceded")}</span>
                            <div>{goalsConceded}</div>
                        </div>
                        <div className={styles.wrapperCard}>
                            <span>{t("matches.statusCard.goalkeeperStats.penaltiesSaved")}</span>
                            <div>{penaltiesSaved}</div>
                        </div>
                    </div>
                </div>
                </div>
            <div className={styles.playerProfileWrapper}>
               <div className={styles.imageTextWrapper}> 
                    <Image src={teamLogo} alt="" className={styles.profileImage}/>
                    <Link href={playerId ? `/profile/${playerId}` : '#'} className={styles.playerProfile}>{t("matches.statusCard.playerProfile")}</Link>
                </div> 
                <Button className="red_text_button" content="Close" handleClick={onClose ?? (() => {})}/>
            </div>
        </div>
    </div>
}