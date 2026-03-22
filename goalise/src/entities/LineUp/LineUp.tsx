'use client'
import LineUpCard from "@/components/LineUpCard"
import MatchesHeader from "../MatchesHeader"
import Link from "next/link"
import styles from './LineUp.module.css';
import { usePathname, useParams } from "next/navigation";
import Image from "next/image";
import clipboard from '../../assets/pngs/clipboard.svg';
export const LineUp = () => {
     const pathname = usePathname();
     const { matchId } = useParams();
     const base = `/matches/${matchId}`;

     const isActive = (href: string) => {
       if (href === base) {
         return pathname === base || pathname === `${base}/groups`;
       }
       return pathname.startsWith(href);
     };
    return  <div className={styles.container}>
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
                        <Image src={clipboard} alt="" className={styles.icon} />
                    </div>
                <div className={styles.title}> Lineup</div>
            </div>
           <div className={styles.teamsWrapper}>  
                <div> 
                    <div className={styles.title}>Team A</div>
                    <LineUpCard />
                </div>
                <div> 
                    <div className={styles.title}>Team B</div>
                    <LineUpCard />
                </div>
            </div>
        </div>
}