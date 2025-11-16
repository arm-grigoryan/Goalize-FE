import { IUnassignedPlayerCardProps } from "./UnassignedPlayerCard.types";
import styles from './UnassignedPlayerCard.module.css';
import Image from "next/image";

const UnassignedPlayerCard: React.FC<IUnassignedPlayerCardProps> = ({
    icon,
    title,
    context,
    link,
    linkText
}) => {
    return <div className={styles.container}>
        <div className={styles.contentWrapper}>
        { icon && 
            <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
                <Image className={styles.icon} src={icon} alt=""/>  
            </div> 
        }
        <div className={styles.titleConatiner}>
            <div className={styles.title}>{title}</div>
            <div className={styles.context}>{context}
                <a href={link} className={styles.linkText}>{linkText}</a>
            </div>
        </div>
        </div>
     </div>
} 

UnassignedPlayerCard.displayName = 'UnassignedPlayerCard';
export default UnassignedPlayerCard;