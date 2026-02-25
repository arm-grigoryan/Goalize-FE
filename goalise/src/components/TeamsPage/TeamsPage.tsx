'use client'
import React, { useState } from "react";
import TeamsCard from "@/entities/TeamsCard";
import teamLogo from '../../assets/pngs/teamLogo.png';
import styles from './TeamsPage.module.css'
import Image from "next/image";
import teamsAdditionIcon from '../../assets/pngs/teamsAdditionIcon.svg';
import Button from "@/shared/Button";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import CreateTeamPopUp from "@/entities/CreateTeamPopUp";

const teams = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  logoUrl: teamLogo,
  name: `AFC Bournemouth ${i + 1}`,
  captain: {
    firstName: "John",
    lastName: `Swliisis ${i + 1}`,
  },
  matchDate: "25-06-2025",
  opponent: {
    name: 'Adam'
  }
}));

export const TeamsPage = () => {
    const {width } = useWindowSize();
    const isMobile = width  <= MEDIA_TABLET_SMALL;
    const text = isMobile ? '' : "Create Team" ;
    const [open, setIsOpen] = useState(false);
    
    return <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
        <div className={styles.wrapper}> 
            <div className={styles.buttonTitleWrapper}>
                {!isMobile &&
                    <div className={styles.button} onClick={() =>setIsOpen(!open)}>
                    <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                        <Image src={teamsAdditionIcon} alt="" className={styles.icon}/>
                    </div>
                </div>}
                <div className={styles.title}>Teams</div>
            </div>
             <Button
                className="icon_button_red"
                icon={teamsAdditionIcon}
                content={text}
                handleClick={() =>setIsOpen(!open)}
            />
        </div>
       <div className={styles.teamsContainer}>
            {teams.map((team) => (
                <TeamsCard
                    key={team.id}
                    logoUrl={team.logoUrl}
                    name={team.name}
                    captain={team.captain}
                    matchDate={team.matchDate}
                    opponent={team.opponent}
                />
        ))}
        <CreateTeamPopUp  open={open} onClose={() =>setIsOpen(!open)}/>
      </div>
    </div>

}