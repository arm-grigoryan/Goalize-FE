import TransferInnerCard from "../TransferInnerCard";
import { ITransferItemCardProps } from "./TransferItemCard.types"
import styles from './TransferItemCard.module.css';
import Image from "next/image";

const TransferItemCard: React.FC<ITransferItemCardProps> = ({
    dateIcon,
    date,
    fromTeamLogo,
    fromTeamName,
    arrowIcon,
    toTeamLogo,
    toTeamName,
}) => {
    return <div className={styles.container}>
            <div className={styles.dateWrapper}>
                {dateIcon && <Image className={styles.dateIcon} src={dateIcon} alt=""/>}
                <div className={styles.date}> {date} </div>
            </div>
            <div className={styles.teamLogoWrapper}> 
               {fromTeamLogo && <Image src={fromTeamLogo} alt=""/>}
                <div className={styles.teamNameWrapper}>
                    <div className={styles.from}> From </div>
                    <div className={styles.teamName}>{fromTeamName} </div>
                </div>
            </div>
            <div> 
                {arrowIcon && <Image  className={styles.arrowIcon} src={arrowIcon} alt=""/>}
            </div>
            <div> 
                {toTeamLogo && <Image src={toTeamLogo} alt=""/>}
                <div className={styles.teamNameWrapper}>
                    <div className={styles.to}> To </div>
                    <div className={styles.teamName}> {toTeamName} </div>
                </div>
            </div>

    </div>
}

TransferItemCard.displayName = 'TransferItemCard';
export default TransferItemCard;