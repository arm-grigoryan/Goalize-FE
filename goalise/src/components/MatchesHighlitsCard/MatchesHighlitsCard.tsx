import Image, { StaticImageData } from "next/image";
import styles from './MatchesHighlitsCard.module.css';
import tshirt from '../../assets/pngs/tshirt.svg'
import CustomDivider from "@/shared/Divider";
import ballIcon from '../../assets/pngs/ballIcon.svg';
import card from '../../assets/pngs/card.svg';
import Link from "next/link";
export interface IMatchesHighlitsCardProps { 
    swapped?: boolean;
    playerNumber?: number;
    playerImage?: StaticImageData;
    playerName?: string;
    assistName?: string;
    goal?: boolean;
    redGard?: boolean;
    yellowCard?: boolean;
    selfGoal?: boolean;
}
export const MatchesHighlitsCard: React.FC<IMatchesHighlitsCardProps> = ({
    playerNumber,
    playerImage,
    playerName,
    assistName,
    goal,
    redGard,
    yellowCard
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.shirtWrapper}>
                <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                    <Image src={tshirt} alt="" className={styles.icon} />
                </div>
                <div className={styles.playerNumber}> {playerNumber} </div>
            </div>
            <div className={styles.infoWrapper}>
               <div className={styles.playerInfoWrapper}> 
                    {playerImage && 
                        <Image src={playerImage} alt="" className={styles.playerImage} />
                    }
                    <Link href={'#'} className={styles.playerName}>{playerName}</Link>
                </div>
               {assistName &&
                    <div className={styles.assistWrapper}>
                        <div className={styles.assistInfoWrapper}> 
                            <span>Assist By</span>
                            <Link href={'#'} className={styles.assistName}>{assistName}</Link>
                        </div>
                        <CustomDivider orientation="vertical" flexItem />
                    </div>
                }
            </div>
            <div className={styles.rightWrapper}>
                {goal && <div className={styles.goal}>
                    <div className={`${styles.iconWrapper} ${styles.blueGlow}`}> 
                        <Image src={ballIcon} alt="" className={styles.icon}/>
                    </div>
                    Goal
                </div>}
                {redGard && <div className={styles.redCard}>
                     <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                        <Image src={card} alt="" className={styles.icon}/>
                    </div>
                    Red Card
                    </div>}
                {yellowCard && <div className={styles.yellowCard}>
                     <div className={`${styles.iconWrapper} ${styles.yellowGlow}`}> 
                        <Image src={card} alt="" className={styles.icon}/>
                    </div>
                    Yellow Card
                    </div>}
            </div>
        </div>
    );
}