import { IUnassignedPlayerCardProps } from "./UnassignedPlayerCard.types";
import styles from './UnassignedPlayerCard.module.css';
import Image from "next/image";
import unassigned from '../../assets/pngs/unassigned.png';
import { useTranslations } from "next-intl";

export const UnassignedPlayerCard: React.FC<IUnassignedPlayerCardProps> = ({
    link,
}) => {
    const t = useTranslations("playerProfile.unassigned")
    return <div className={styles.container}>
        <div className={styles.contentWrapper}>
            <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
                <Image className={styles.icon} src={unassigned} alt=""/>  
            </div> 
        <div className={styles.titleConatiner}>
            <div className={styles.title}>{t("title")}</div>
            <div className={styles.context}>{t("label")}
                <a href={link} className={styles.linkText}>{t("linkText")}</a>
            </div>
        </div>
        </div>
     </div>
};