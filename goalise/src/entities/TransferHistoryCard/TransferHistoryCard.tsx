import { ITransferHistoryCardProps } from "./TransferHistoryCard.types";
import styles from './TransferHistory.module.css';
import Image from "next/image";
import TransferItemCard from "../TransferItemCard";
import Scroll from "@/shared/Scroll";
import transferHistoryIcon from '../../assets/pngs/transferHistoryIcon.png';
import transferEmptyState from '../../assets/pngs/transferEmptyState.png';
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useTranslations } from "next-intl";

 export const TransferHistoryCard: React.FC<ITransferHistoryCardProps> = ({
    object,
 }) => {
    const { width } = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    const t = useTranslations("playerProfile.transferHistory")
    return <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
            <div className={styles.titleWrapper}>
               <Image src={transferHistoryIcon}  className={styles.icon} alt=""/>
                <div className={styles.titleContainer}>
                    <div className={styles.title }> {t("title")}</div>
                    <div className={styles.label}>{t("label")} </div>
                </div>
            </div>
            <div className={styles.content}> 
                {!object && <div className={styles.emptyState}> 
                    <Image src={transferEmptyState} alt=""/>
                    <div className={styles.emptyStateText}> {t("emptyStateText")}</div>
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