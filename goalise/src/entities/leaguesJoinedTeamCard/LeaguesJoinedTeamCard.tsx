"use client";

import Image from "next/image";
import styles from "./leaguesJoinedTeamCard.module.css";
import logo from "/public/images/Ellipse.png";
import captainImage from "/public/images/captain.png";

interface LeaguesJoinedTeamCardProps {
  teamName?: string;
  captainName?: string;
}

export const LeaguesJoinedTeamCard = ({
  teamName,
  captainName,
}: LeaguesJoinedTeamCardProps) => {
  return (
    <div className={styles.leagues_joined_team_card}>
      <Image src={logo} alt="Logo" className={styles.logo} />
      <div className={styles.team_name}>{teamName}</div>
      <div>
        <div className={styles.captain_info}>
          <Image src={captainImage} alt="Captain" className={styles.captain} />
          <div>
            <div>{captainName}</div>
            <div>captain</div>
          </div>
        </div>
      </div>
    </div>
  );
};
