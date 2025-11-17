import { ITransferItemCardProps } from "./TransferItemCard.types"
import styles from './TransferItemCard.module.css';
import Image from "next/image";
import toArrowIcon from '../../assets/pngs/toarrowIcon.png';
import calendarIcon from '../../assets/pngs/calendar.png';
const TransferItemCard: React.FC<ITransferItemCardProps> = ({
    date,
    fromTeamLogo,
    fromTeamName,
    toTeamLogo,
    toTeamName,
}) => {
    return <div className={styles.container}>
            <div className={styles.dateWrapper}>
                {calendarIcon && <Image className={styles.dateIcon} src={calendarIcon} alt=""/>}
                <div className={styles.date}> {date} </div>
            </div>
            <div className={styles.teamLogoWrapper}> 
               {fromTeamLogo && <Image src={fromTeamLogo} alt=""/>}
                <div className={styles.teamNameWrapper}>
                    <div className={styles.from}> From </div>
                    <div className={styles.teamName}>{fromTeamName} </div>
                </div>
            </div>
            <div className={styles.toArrow}> 
                {toArrowIcon && <Image  className={styles.arrowIcon} src={toArrowIcon} alt=""/>}
            </div>
            <div className={styles.teamLogoWrapper}> 
                {toTeamLogo && <Image src={toTeamLogo} alt=""/>}
                <div className={styles.teamNameWrapper}>
                    <div className={styles.from}> To </div>
                    <div className={styles.teamName}> {toTeamName} </div>
                </div>
            </div>

    </div>
}

TransferItemCard.displayName = 'TransferItemCard';
export default TransferItemCard;