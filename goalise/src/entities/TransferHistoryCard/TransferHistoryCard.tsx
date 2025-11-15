import { ITransferHistoryCardProps } from "./TransferHistoryCard.types";
import styles from './TransferHistory.module.css';
import Image from "next/image";

 const TransferHistoryCard: React.FC<ITransferHistoryCardProps> = ({
    icon,
    title,
    context
 }) => {
    return <div className={styles.container}>
            <div className={styles.titleWrapper}>
                { icon && <Image src={icon}  className={styles.icon} alt=""/> }
                <div className={styles.titleContainer}>
                    <div className={styles.title }>{title} </div>
                    <div className={styles.context}>{context} </div>
                </div>
            </div>
    </div>
 };

 TransferHistoryCard.displayName = "TransferHistoryCard";
 export default TransferHistoryCard;