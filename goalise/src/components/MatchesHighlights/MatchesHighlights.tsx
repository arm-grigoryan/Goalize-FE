import styles from './MatchesHighlights.module.css';
import Image from "next/image";
import calendarIcon from '../../assets/pngs/calendar.svg'
import MatchesHighlitsCard from '../MatchesHighlitsCard';
import teamLogo from '../../assets/pngs/teamLogo.png';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MEDIA_TABLET_SMALL } from '@/constants/windowSizes';
export const MatchesHighlights: React.FC = () => {
       const { width } = useWindowSize();
       const isMobile = width <= MEDIA_TABLET_SMALL;
    return <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
            <div className={styles.titleWrapper}> 
                    <div className={`${styles.button} ${styles.redGlow}`}>
                        <Image src={calendarIcon} alt="" className={styles.icon} />
                    </div>
                <div className={styles.title}> Highlight</div>
            </div>
            <div className={styles.highlightsWrapper}>
            {isMobile ? (
                <div className={styles.mobileList}>
                    {/* LEFT */}
                    <MatchesHighlitsCard 
                        playerNumber={23}
                        playerImage={teamLogo}
                        playerName='Poghos Poghosyan'
                        assistName='Vruyr Saghatelyan'
                        goal
                    />
                    <MatchesHighlitsCard 
                        playerNumber={23}
                        playerImage={teamLogo}
                        playerName='Poghos Poghosyan'
                        assistName='Vruyr Saghatelyan'
                        redGard
                        swapped
                    />
                    <MatchesHighlitsCard 
                        playerNumber={23}
                        playerImage={teamLogo}
                        playerName='Poghos Poghosyan'
                        yellowCard
                    />

                    {/* RIGHT */}
                    <MatchesHighlitsCard 
                        playerNumber={23}
                        playerImage={teamLogo}
                        playerName='Poghos Poghosyan'
                        assistName='Vruyr Saghatelyan'
                        goal
                        swapped
                    />
                    <MatchesHighlitsCard 
                        playerNumber={23}
                        playerImage={teamLogo}
                        playerName='Poghos Poghosyan'
                        assistName='Vruyr Saghatelyan'
                        redGard
                    />
                    <MatchesHighlitsCard 
                        playerNumber={23}
                        playerImage={teamLogo}
                        playerName='Poghos Poghosyan'
                        assistName='Vruyr Saghatelyan'
                        yellowCard
                        swapped
                    />
                </div>
            ) : (
                <>
                    <div className={styles.sideLeft}>
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            goal
                        />
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            redGard
                        />
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            yellowCard
                        />
                    </div>

                    <div className={styles.line}>
                        <div className={styles.iconWrapper}><span className={styles.dot} /></div>
                        <div className={styles.iconWrapper}><span className={styles.dot} /></div>
                        <div className={styles.iconWrapper}><span className={styles.dot} /></div>
                        <div className={styles.iconWrapper}><span className={styles.dot} /></div>
                        <div className={styles.iconWrapper}><span className={styles.dot} /></div>
                        <div className={styles.iconWrapper}><span className={styles.dot} /></div>
                    </div>

                    <div className={styles.sideRight}>
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            goal
                            swapped
                        />
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            redGard
                            swapped
                        />
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            yellowCard
                            swapped
                        />
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            goal
                            swapped
                        />
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            redGard
                            swapped
                        />
                        <MatchesHighlitsCard 
                            playerNumber={23}
                            playerImage={teamLogo}
                            playerName='Poghos Poghosyan'
                            assistName='Vruyr Saghatelyan'
                            yellowCard
                            swapped
                        />
                    </div>
                </>
            )}
        </div>
               
        </div>;
}