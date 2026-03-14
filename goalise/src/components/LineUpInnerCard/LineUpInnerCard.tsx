import React from "react";
import styles from './LineUpInnerCard.module.css';
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import shirt from '../../assets/pngs/shirt.svg';

export interface ILineUpInnerCardProps {
    playerName?: string;
    playerImage?: StaticImageData;
    playerNumber?: number;
}
export const LineUpInnerCard: React.FC<ILineUpInnerCardProps> = ({
    playerImage,
    playerName,
    playerNumber
}) => {
    return <div className={styles.container}>
            <div className={styles.playerInfoWrapper}>
               <div>
                    { playerImage &&  
                        <Image src={playerImage} alt=""  className={styles.playerImage} />}
                </div>
               <Link className={styles.playerName} href={'#'}>{playerName}</Link>
            </div>
            <div className={styles.playerNumberWrapper}> 
                <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                    <Image src= {shirt} alt="" />
                </div>
                <div className={styles.shirtNumber}>{playerNumber}</div>
            </div>
    </div>
}