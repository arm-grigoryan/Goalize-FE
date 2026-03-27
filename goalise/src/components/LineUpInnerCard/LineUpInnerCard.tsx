import React from "react";
import styles from './LineUpInnerCard.module.css';
import Image, { StaticImageData } from "next/image";
import shirt from '../../assets/pngs/shirt.svg';

export interface ILineUpInnerCardProps {
    playerName?: string;
    playerImage?: string | StaticImageData;
    playerNumber?: number;
    onClick?: () => void;
}
export const LineUpInnerCard: React.FC<ILineUpInnerCardProps> = ({
    playerImage,
    playerName,
    playerNumber,
    onClick,
}) => {
    return <div className={styles.container} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
            <div className={styles.playerInfoWrapper}>
               <div>
                    { playerImage &&
                        <Image src={playerImage as string} alt="" className={styles.playerImage} width={38} height={38} unoptimized={typeof playerImage === 'string'} />}
                </div>
               <span className={styles.playerName}>{playerName}</span>
            </div>
            <div className={styles.playerNumberWrapper}> 
                <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                    <Image src= {shirt} alt="" />
                </div>
                <div className={styles.shirtNumber}>{playerNumber}</div>
            </div>
    </div>
}