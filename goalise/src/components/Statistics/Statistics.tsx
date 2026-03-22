'use client';
import MatchesHeader from "@/entities/MatchesHeader";
import styles from './Statistics.module.css';
import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import statistics from '../../assets/pngs/statistics.svg';
import StatisticsCard from "@/entities/StatisticsCard";
export const Statistics: React.FC = () => {
    const pathname = usePathname();
    const { matchId } = useParams();
    const base = `/matches/${matchId}`;

    const isActive = (href: string) => {
      if (href === base) {
        return pathname === base || pathname === `${base}/groups`;
      }
      return pathname.startsWith(href);
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
            <div>
                <StatisticsCard title="Total Shots" progressLeft={20} progressRight={10} leftVariant="red"/>
                <StatisticsCard title="Total Shots Completed" progressLeft={65} progressRight={55} rightVariant="red"/>
                <StatisticsCard title="Total Passes" progressLeft={10} progressRight={15} leftVariant="red"/>
                <StatisticsCard title="Corners" progressLeft={8} progressRight={12} leftVariant="red"/>
            </div>
        </div>
    );
} 