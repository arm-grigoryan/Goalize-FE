import React from "react";
import styles from './ShowMoreCard.module.css';
import Image from "next/image";
import chessPiece from '../../assets/pngs/chessPiece.svg';
import remove from '../../assets/pngs/remove.svg';
import shirt from '../../assets/pngs/shirt.svg';
import invite from '../../assets/pngs/invite.svg';

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
    return <div className={styles.container}>
        {isCaptain ? <div>
                        {!isOwnCard && <div className={styles.item} onClick={onMakeCaptain}>
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                <Image src={chessPiece} alt="" className={styles.icon}/>
                            </div>
                            <div className={styles.text}>Make Captain</div>
                        </div>}
                        {!isOwnCard && <div className={styles.item} onClick={onRemove}>
                            <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                <Image src={remove} alt="" className={styles.icon}/>
                            </div>
                            <div className={styles.text}>Remove</div>
                        </div>}
                        <div className={styles.item} onClick={onEditShirtNumber}>
                           <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                             <Image src={shirt} alt="" className={styles.icon}/>
                             </div>
                            <div className={styles.text}>Edit Shirt Number</div>
                        </div>
                    </div> : <div>
                                <div className={styles.item} onClick={onInvite}>
                                    <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                                        <Image src={invite} alt="" className={styles.icon}/>
                                    </div>
                                   <div className={styles.text}>Invite</div>
                                </div>
                            </div>
            }
    </div>
}
