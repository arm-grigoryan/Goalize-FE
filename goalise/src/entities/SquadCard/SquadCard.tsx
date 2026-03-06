'use client'
import React from "react";
import styles from './SquadCard.module.css';
import Image from "next/image";
import toBeDeleted from '../../assets/pngs/toBeDeleted.png';
import dots from '../../assets/pngs/dots.svg';
// import ShowMoreCard from "../ShowMoreCard";
import Link from "next/link";

export interface ISquadCardProps {
    teamName?: string;
    playerNumber?: string;

}
export const SquadCard: React.FC<ISquadCardProps> =({
    teamName,
    playerNumber
})=> {
    return <div className={styles.container}>
       <div className={styles.wrapper}>
         <div className={styles.nameNumberContainer}>
            <Image src={toBeDeleted} alt="" className={styles.image}/>
        
         <div className={styles.playerNumberContainer}>
                        {playerNumber && (
                          <div className={styles.playerNumber}>
                            {playerNumber}
                          </div>
                        )}
                      </div>
        </div>
        <Link href={'#'} className={styles.teamName}>{teamName}</Link>
        <Image src={dots} alt="" className={styles.more} />
        {/* <ShowMoreCard isCaptain/> */}
        </div>
    </div>
}