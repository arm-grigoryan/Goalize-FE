'use client';
import MatchesHeader from "@/entities/MatchesHeader";
import styles from './Statistics.module.css';
import { usePathname, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import statistics from '../../assets/pngs/statistics.svg';
import highlightsEmpty from '../../assets/pngs/highlightsEmpty.svg';
import highlightsEmptyMobile from '../../assets/pngs/highlightsEmptyMobile.svg';
import StatisticsCard from "@/entities/StatisticsCard";
import { useGetMatchStatsQuery, useGetMatchByIdQuery } from "@/app/store/services/api";
import { useEffect } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const Statistics: React.FC = () => {
    const pathname = usePathname();
    const { matchId } = useParams();
    const router = useRouter();
    const base = `/matches/${matchId}`;
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;

    const isActive = (href: string) => {
      if (href === base) {
        return pathname === base || pathname === `${base}/groups`;
      }
      return pathname.startsWith(href);
    };

    const { data: stats, isLoading, isSuccess, error } = useGetMatchStatsQuery(Number(matchId));
    const { data: match } = useGetMatchByIdQuery(Number(matchId));

    useEffect(() => {
        if (error && 'status' in error && error.status === 404) {
            router.replace('/not-found');
        }
    }, [error, router]);

    const renderContent = () => {
        if (isLoading) return null;

        // 204 — match exists but stats not filled yet
        if (isSuccess && !stats) {
            return <div className={styles.emptyWrapper}> 
                        <Image src={isMobile ? highlightsEmptyMobile : highlightsEmpty} alt="" />
                        <div className={styles.emptyText}> No stats are available at the moment </div>
                    </div> 
        }

        if (!stats) return null;

        const rows: { title: string; home: number; away: number }[] = [
            { title: "Total Shots",            home: stats.homeTeamShots,         away: stats.awayTeamShots },
            { title: "Shots On Target",        home: stats.homeTeamShotsComplete, away: stats.awayTeamShotsComplete },
            { title: "Total Passes",           home: stats.homeTeamPass,          away: stats.awayTeamPass },
            { title: "Passes Completed",       home: stats.homeTeamPassComplete,  away: stats.awayTeamPassComplete },
            { title: "Fouls",                  home: stats.homeTeamFouls,         away: stats.awayTeamFouls },
            { title: "Corners",                home: stats.homeTeamCorners,       away: stats.awayTeamCorners },
        ];

        return (
            <div>
                { isMobile && 
                <div className={styles.teamNamesWrapper}> 
                    <div className={styles.teamName}>{match?.homeTeam.name ?? 'Home'}</div>
                    <div className={styles.teamName}>{match?.awayTeam.name ?? 'Away'}</div>
                </div>}
                {rows.map((row) => {
                    const total = row.home + row.away;
                    const leftWidth = total === 0 ? 0 : (row.home / total) * 100;
                    const rightWidth = total === 0 ? 0 : (row.away / total) * 100;
                    const leftVariant: "blue" | "red" = row.home < row.away ? "red" : "blue";
                    const rightVariant: "blue" | "red" = row.away < row.home ? "red" : "blue";

                    return (
                        <StatisticsCard
                            key={row.title}
                            title={row.title}
                            progressLeft={leftWidth}
                            progressRight={rightWidth}
                            valueLeft={row.home}
                            valueRight={row.away}
                            leftVariant={leftVariant}
                            rightVariant={rightVariant}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <MatchesHeader />
                <div className={styles.tabs}>
                    <Link className={`${styles.tab} ${isActive(`${base}`) ? styles.isActive : ""}`} href={base}>
                         Highlight
                    </Link>
                    <Link className={`${styles.tab} ${isActive(`${base}/stats`) ? styles.isActive : ""}`} href={`${base}/stats`}>
                        Stats
                    </Link>
                    <Link className={`${styles.tab} ${isActive(`${base}/lineUp`) ? styles.isActive : ""}`} href={`${base}/lineup`}>
                        Lineup
                    </Link>
                </div>
            <div className={styles.titleWrapper}>
                    <div className={`${styles.button} ${styles.redGlow}`}>
                        <Image src={statistics} alt="" className={styles.icon} />
                    </div>
                <div className={styles.title}> Statistics </div>
            </div>
            {renderContent()}
        </div>
    );
}
