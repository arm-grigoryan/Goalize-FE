import { IUnassignedPlayerCardProps } from "./UnassignedPlayerCard.types";
import styles from './UnassignedPlayerCard.module.css';
import Image from "next/image";
import unassigned from '../../assets/pngs/unassigned.png';
import en from "../../../messages/en.json";
const UnassignedPlayerCard: React.FC<IUnassignedPlayerCardProps> = ({
    link,
}) => {
    return <div className={styles.container}>
        <div className={styles.contentWrapper}>
            <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
                <Image className={styles.icon} src={unassigned} alt=""/>  
            </div> 
        <div className={styles.titleConatiner}>
            <div className={styles.title}>{en.playerProfile.unassigned.title}</div>
            <div className={styles.context}>{en.playerProfile.unassigned.label}
                <a href={link} className={styles.linkText}>{en.playerProfile.unassigned.linkText}</a>
            </div>
        </div>
        </div>
     </div>
} 

UnassignedPlayerCard.displayName = 'UnassignedPlayerCard';
export default UnassignedPlayerCard;