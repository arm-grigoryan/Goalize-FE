import React from "react";
import styles from './LineUpInnerCard.module.css';
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import shirt from '../../assets/pngs/shirt.svg';

export interface ILineUpInnerCardProps {
    playerName?: string;
    playerImage?: string | StaticImageData;
    playerNumber?: number;
    playerHref?: string;
    onClick?: () => void;
}
export const LineUpInnerCard: React.FC<ILineUpInnerCardProps> = ({
    playerImage,
    playerName,
    playerNumber,
    playerHref = '#',
    onClick,
}) => {
    return <div className={styles.container} onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
            <div className={styles.playerInfoWrapper}>
               <div>
                    { playerImage &&
                        <Image src={playerImage as string} alt="" className={styles.playerImage} width={38} height={38} unoptimized={typeof playerImage === 'string'} />}
                </div>
               <Link className={styles.playerName} href={playerHref}>{playerName}</Link>
            </div>
            <div className={styles.playerNumberWrapper}> 
                <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                    <Image src= {shirt} alt="" />
                </div>
                <div className={styles.shirtNumber}>{playerNumber}</div>
            </div>
    </div>
}