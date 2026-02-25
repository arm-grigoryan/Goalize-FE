'use client'
import React from "react";
import styles from './TeamsCard.module.css';
import Image, { StaticImageData } from "next/image";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export interface ITeamsCardProps {
    logoUrl?: StaticImageData;
    captain?: {
      id?: string,
      firstName?: string,
      lastName?: string,
      profilePic?: string,
      birthDate?: Date,
      age?: number,
      workingFoot?: string
    };
    name?: string;
    matchDate?: string;
    opponent?: {
      id?: number,
      name?: string,
      logoUrl?: string,
      captainId?: number
    },
    handleClick?: () => void;
}
export const TeamsCard: React.FC<ITeamsCardProps> = ({
    logoUrl,
    captain,
    name,
    matchDate,
    opponent,
}) => {
    const {width} = useWindowSize();
    const isMobile = width <= MEDIA_TABLET_SMALL;
    return <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
            <div className={styles.logoNameWrapper}>
              {logoUrl && 
                <Image src={logoUrl} alt="" className={styles.logo}/>
              }
                <div className={styles.nameWrapper}>
                    Captain: 
                    <span> 
                        {captain?.firstName + ' ' + captain?.lastName}
                    </span>
                </div>
            </div>
            <div className={styles.titleBoxWrapper}>
                <div className={styles.titleWrapper}>{name}</div>
                <div className={styles.boxesContainer}>
                    <div className={styles.box}>Next Match: <span> {matchDate}</span></div>
                    <div className={styles.box}>Opponent: <span> {opponent?.name}</span></div>
                </div>
            </div>
    </div>
};