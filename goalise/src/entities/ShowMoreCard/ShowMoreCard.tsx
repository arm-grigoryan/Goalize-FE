"use client";
import React from "react";
import styles from './ShowMoreCard.module.css';
import Image from "next/image";
import chessPiece from '../../assets/pngs/chessPiece.svg';
import remove from '../../assets/pngs/remove.svg';
import shirt from '../../assets/pngs/shirt.svg';
import invite from '../../assets/pngs/invite.svg';
import { useTranslations } from "next-intl";

export interface IShowMoreCardProps {
    isCaptain?: boolean;
    isOwnCard?: boolean;
    onMakeCaptain?: () => void;
    onRemove?: () => void;
    onEditShirtNumber?: () => void;
    onInvite?: () => void;
}

export const ShowMoreCard: React.FC<IShowMoreCardProps> = ({
    isCaptain,
    isOwnCard,
    onMakeCaptain,
    onRemove,
    onEditShirtNumber,
    onInvite,
}) => {
    const t = useTranslations("showMoreCard");
    return <div className={styles.container}>
        {isCaptain ? <div>
                        {!isOwnCard && <div className={styles.item} onClick={onMakeCaptain}>
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                <Image src={chessPiece} alt="" className={styles.icon}/>
                            </div>
                            <div className={styles.text}>{t("makeCaptain")}</div>
                        </div>}
                        {!isOwnCard && <div className={styles.item} onClick={onRemove}>
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                <Image src={remove} alt="" className={styles.icon}/>
                            </div>
                            <div className={styles.text}>{t("remove")}</div>
                        </div>}
                        <div className={styles.item} onClick={onEditShirtNumber}>
                           <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                             <Image src={shirt} alt="" className={styles.icon}/>
                             </div>
                            <div className={styles.text}>{t("editShirtNumber")}</div>
                        </div>
                    </div> : <div>
                                <div className={styles.item} onClick={onInvite}>
                                    <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                        <Image src={invite} alt="" className={styles.icon}/>
                                    </div>
                                   <div className={styles.text}>{t("invite")}</div>
                                </div>
                            </div>
            }
    </div>
}
