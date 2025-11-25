import { ITransferItemCardProps } from "./TransferItemCard.types"
import styles from './TransferItemCard.module.css';
import Image from "next/image";
import toArrowIcon from '../../assets/pngs/arrow.svg';
import dateIcon from '../../assets/pngs/dateIcon.svg';
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export const TransferItemCard: React.FC<ITransferItemCardProps> = ({
    date,
    fromTeamLogo,
    fromTeamName,
    toTeamLogo,
    toTeamName,
}) => {
      const { width } = useWindowSize();
        const isMobile = width <= MEDIA_TABLET_SMALL;
    return <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
        <div className={styles.wrapper}>
            <div className={styles.dateWrapper}>
                <div className={`${styles.iconWrapper} ${styles.blueGlow}`}> 
                    <Image className={styles.dateIcon} src={dateIcon} alt=""/>
                </div>
                <div className={styles.date}> {date} </div>
            </div>
            <div className={styles.teamContainer}> 
            <div className={styles.teamLogoWrapper}> 
               {fromTeamLogo && <Image src={fromTeamLogo} alt="" className={styles.teamLogo}/>}
                <div className={styles.teamNameWrapper}>
                    {!isMobile && <div className={styles.from}> From </div>}
                    <div className={styles.teamName}>{fromTeamName} </div>
                </div>
            </div>
            <div className={styles.toArrow}> 
                {toArrowIcon && <Image  className={styles.arrowIcon} src={toArrowIcon} alt=""/>}
            </div>
            <div className={styles.teamLogoWrapper}> 
                {toTeamLogo && <Image src={toTeamLogo} alt=""  className={styles.teamLogo}/>}
                <div className={styles.teamNameWrapper}>
                     {!isMobile &&<div className={styles.from}> To </div>}
                    <div className={styles.teamName}> {toTeamName} </div>
                </div>
            </div>
            </div>
        </div>
    </div>
};