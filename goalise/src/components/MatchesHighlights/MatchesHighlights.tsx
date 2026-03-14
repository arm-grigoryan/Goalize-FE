import styles from './MatchesHighlights.module.css';
import Image from "next/image";
import calendarIcon from '../../assets/pngs/calendar.svg'
import MatchesHighlitsCard from '../MatchesHighlitsCard';
import teamLogo from '../../assets/pngs/teamLogo.png';
export const MatchesHighlights: React.FC = () => {
    return <div className={styles.container}>
            <div className={styles.titleWrapper}> 
                    <div className={`${styles.button} ${styles.redGlow}`}>
                        <Image src={calendarIcon} alt="" className={styles.icon} />
                    </div>
                <div className={styles.title}> Highlight</div>
            </div>
            <div className={styles.highlightsWrapper}>
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
                        yellowCard
                    />
                </div>
                 <div className={styles.line}>
                    <div className={styles.iconWrapper}> 
                        <span className={styles.dot} />
                    </div>
                    <div className={styles.iconWrapper}> 
                        <span className={styles.dot} />
                    </div>
                   <div className={styles.iconWrapper}> 
                        <span className={styles.dot} />
                    </div>
                    <div className={styles.iconWrapper}> 
                        <span className={styles.dot} />
                    </div>
                    <div className={styles.iconWrapper}> 
                        <span className={styles.dot} />
                    </div>
                    <div className={styles.iconWrapper}> 
                        <span className={styles.dot} />
                    </div>
                </div>
                <div className={styles.sideRight}>
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
                        yellowCard
                    />
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
                        yellowCard
                    />
                </div>
            </div>
            
        </div>;
}