'use client';
import MatchesHighlights from "@/components/MatchesHighlights";
import MatchesHeader from "../MatchesHeader";
import styles from './Matches.module.css';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
export const MatchesPage: React.FC = () => {
  const { width } = useWindowSize();
      const isMobile = width <= MEDIA_TABLET_SMALL;
      const pathname = usePathname();
      const base = `/matches`;
    
      const isActive = (href: string) => {
        if (href === base) {
          return pathname === base || pathname === `${base}/groups`;
        }
        return pathname.startsWith(href);
      };
    return  <div className={`${styles.container} ${isMobile ? styles.mobileContainer : ''}`}>
                <MatchesHeader />
                <div className={styles.tabs}>
                    <Link className={`${styles.tab} ${isActive(`${base}`) ? styles.isActive : ""}`} href={base}>
                         Highlight
                    </Link>
                    <Link className={`${styles.tab} ${isActive(`${base}/stats`) ? styles.isActive : ""}`} href={`${base}/stats`}> 
                        Stats
                    </Link>
                    <Link className={`${styles.tab} ${isActive(`${base}/lineUp`) ? styles.isActive : ""}`} href={`${base}/lineUp`}> 
                        Lineup
                    </Link>
                </div>
                <MatchesHighlights />
            </div>;
}