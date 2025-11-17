import { IMatchCardProps } from "./MatchCard.types";
import styles from './MatchCard.module.css';
import Image from "next/image";
import calendarIcon from '../../assets/pngs/calendar.png';
import ballIcon from '../../assets/pngs/ballIcon.png';
import peopleIcon from '../../assets/pngs/peopleIcon.png';
import card from '../../assets/pngs/cardIcon.png';
const MatchCard: React.FC<IMatchCardProps> = ({
    fisrtTeamName,
    firstTeamNameValue,
    secondTeamName,
    secondTeamNameValue,
    date,
    goalsCount,
    peopleCount,
    redCardsCount,
    yellowCardsCount,
}) => {
    return <div className={styles.container}> 
        <div className={styles.leftSideContainer}> 
            <div className={styles.firstTeam}>
                <div className={styles.teamName}>{fisrtTeamName}</div>
                <div className={styles.teamValue}>{firstTeamNameValue} </div>
            </div>
            <div className={styles.secondTeam}>
                <div className={styles.teamName}>{secondTeamName}</div>
                <div className={styles.teamValue}>{secondTeamNameValue} </div>
            </div>
        </div>
        <div className={styles.rightSideContainer}>
            <div className={styles.dateWrapper}> 
                <Image src={calendarIcon}  alt="" className={styles.dateIcon}/>
                <div className={styles.date}>{date}</div>
            </div>
            <div className={styles.cardsContainer}>
                <div className={styles.cards}>
                    <Image className={styles.icons} src={ballIcon} alt=""/>
                    <div className={styles.values}>{goalsCount}</div>
                </div>
                <div className={styles.cards}>
                    <Image className={styles.icons} src={peopleIcon} alt=""/>
                    <div className={styles.values}>{peopleCount} </div>
                </div>
                <div className={styles.cards}>
                    <Image className={styles.icons} src={card} alt=""/>
                    <div className={styles.values}>{redCardsCount}</div>
                </div>
                <div className={styles.cards}>
                    <Image className={styles.icons} src={card} alt=""/>
                    <div className={styles.values}>{yellowCardsCount}</div>
                </div>
            </div>
        </div>
    </div>
};

MatchCard.displayName = 'MatchCard';
export default MatchCard;