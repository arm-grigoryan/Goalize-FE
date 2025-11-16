import { ITransferHistoryCardProps } from "./TransferHistoryCard.types";
import styles from './TransferHistory.module.css';
import Image from "next/image";
import TransferItemCard from "../TransferItemCard/TransferItemCard";
import Scroll from "@/shared/Scroll/Scroll";
 const TransferHistoryCard: React.FC<ITransferHistoryCardProps> = ({
    icon,
    title,
    context,
    object,
 }) => {
    return <div className={styles.container}>
            <div className={styles.titleWrapper}>
                { icon && <Image src={icon}  className={styles.icon} alt=""/> }
                <div className={styles.titleContainer}>
                    <div className={styles.title }>{title} </div>
                    <div className={styles.context}>{context} </div>
                </div>
            </div>
            <div> 
                <Scroll> 
                    {object?.map((obj, i)=> {
                        return <> 
                            <TransferItemCard 
                                    key={i}
                                    dateIcon={obj.dateIcon}
                                    date ={obj.date}
                                    fromTeamLogo = {obj.fromTeamLogo}
                                    fromTeamName ={ obj.fromTeamName}
                                    arrowIcon={obj.arrowIcon}
                                    toTeamLogo={obj.toTeamLogo}
                                    toTeamName={obj.toTeamName}
                                />
                            </> 
                    })}
                    </Scroll> 
                </div>
    </div>
 };

 TransferHistoryCard.displayName = "TransferHistoryCard";
 export default TransferHistoryCard;