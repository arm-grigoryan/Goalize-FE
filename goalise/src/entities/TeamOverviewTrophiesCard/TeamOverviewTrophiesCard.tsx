import Image, { StaticImageData } from "next/image";
import React from "react";
import styles from './TeamOverviewTrophiesCard.module.css';
import teamLogo from '../../assets/pngs/teamLogo.png';
import goldTrophie from '../../assets/pngs/goldenTrophy.svg';
import silverTrophie from '../../assets/pngs/silverTrophie.svg';
import bronze from '../../assets/pngs/bronzeTrophie.svg';
export interface ITeamOverviewTrophiesCardPrps {
    icon?: StaticImageData;
    leagueName?: string;
    type?: 'gold' | 'silver' | 'bronze';
}
export const TeamOverviewTrophiesCard: React.FC<ITeamOverviewTrophiesCardPrps> = ({
    type
}) => {
    return <div className={styles.container}>
        <div className={styles.logoNameWrapper}>
            <Image src={teamLogo} alt=""/>
            <div className={styles.name}>League Name</div>
        </div>
        <Image src={type === 'gold' ? goldTrophie : type === 'silver' ? silverTrophie : bronze} alt="" className={styles.trophie}/>
    </div>
}