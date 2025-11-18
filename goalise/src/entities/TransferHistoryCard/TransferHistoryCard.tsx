import { ITransferHistoryCardProps } from "./TransferHistoryCard.types";
import styles from './TransferHistory.module.css';
import Image from "next/image";
import TransferItemCard from "../TransferItemCard/TransferItemCard";
import Scroll from "@/shared/Scroll/Scroll";
import transferHistoryIcon from '../../assets/pngs/transferHistoryIcon.png';
import en from '../../../messages/en.json';
import transferEmptyState from '../../assets/pngs/transferEmptyState.png';
 const TransferHistoryCard: React.FC<ITransferHistoryCardProps> = ({
    object,
 }) => {
    return <div className={styles.container}>
            <div className={styles.titleWrapper}>
               <Image src={transferHistoryIcon}  className={styles.icon} alt=""/>
                <div className={styles.titleContainer}>
                    <div className={styles.title }> {en.playerProfile.transferHistory.title}</div>
                    <div className={styles.label}>{en.playerProfile.transferHistory.label} </div>
                </div>
            </div>
            <div> 
                {!object && <div className={styles.emptyState}> 
                    <Image src={transferEmptyState} alt=""/>
                    <div className={styles.emptyStateText}> {en.playerProfile.transferHistory.emptyStateText}</div>
                    </div>}
                <Scroll> 
                    {object?.map((obj, i)=> {
                        return <> 
                            <TransferItemCard 
                                    key={i}
                                    date ={obj.date}
                                    fromTeamLogo = {obj.fromTeamLogo}
                                    fromTeamName ={ obj.fromTeamName}
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