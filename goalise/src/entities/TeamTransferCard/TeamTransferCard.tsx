'use client'
import Image, { StaticImageData } from "next/image";
import React from "react";
import styles from './TeamTransferCard.module.css';
import calendarIcon from '../../assets/pngs/calendarIcon.svg';
import CustomDivider from "@/shared/Divider";
import left from '../../assets/pngs/left.svg';
import out from '../../assets/pngs/out.svg';
import Link from "next/link";

export interface ITeamTransferCardProps {
  date: string;
  teamLogo: string | StaticImageData;
  teamName: string;
  teamNameTooltip?: string;
  playerName?: string;
  playerLogo?: StaticImageData;
  contract?: string;
  playerIn?: boolean;
}
export const TeamTransferCard: React.FC<ITeamTransferCardProps>= ({
     date,
    teamLogo,
    teamName,
    playerName,
    playerLogo,
    contract,
    playerIn
}) => {
    return <div className={`${styles.card}`}>
      <div> 
        <div className={styles.date}>
        <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
          <Image src={calendarIcon} alt="" className={styles.icon} />
        </div>
        {date}
      </div>
      </div>
      <CustomDivider flexItem orientation="vertical" />
        <div className={styles.playerWrapper}>
            {playerLogo && <Image src={playerLogo} alt=""/>}
            <div className={styles.playerNameWrapper}>
                <span>Player Name</span>
                <Link className={styles.playerName} href={'#'}>{playerName}</Link>
            </div>
        </div>
    <div className={`${playerIn ? styles.infoWrapperBlue : styles.infoWrapperRed}`}> 
            <div className={styles.inOutButton}>
                <Image src={playerIn ? left : out} alt="" className={styles.inOutIcon}/>
                <div> {playerIn ? "Player In" : "Player Out"}</div>
            </div>
            <div className={styles.teamWrapper}>  
                <Image src={teamLogo} alt="" />
                <Link className={styles.teamName} href={'#'}>{teamName} </Link>
            </div>
    </div>
    <CustomDivider flexItem orientation="vertical"/>
    <div className={styles.contractWrapper}>
        <span> Contract:</span>
        <div className={styles.contract}>{contract}</div>
    </div>
    </div>
}