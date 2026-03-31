"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./LeaguesJoinedTeamCard.module.css";
import logo from "/public/images/Ellipse.png";
import captainImage from "/public/images/captain.png";

interface LeaguesJoinedTeamCardProps {
  teamId?: number;
  teamName?: string;
  teamLogoUrl?: string;
  captainName?: string;
  captainPic?: string;
}

export const LeaguesJoinedTeamCard = ({
  teamId,
  teamName,
  teamLogoUrl,
  captainName,
  captainPic,
}: LeaguesJoinedTeamCardProps) => {
  const resolvedLogo = teamLogoUrl?.startsWith("http") ? teamLogoUrl : logo;
  const resolvedCaptainPic = captainPic?.startsWith("http") ? captainPic : captainImage;

  const card = (
    <div className={styles.leagues_joined_team_card}>
      <Image src={resolvedLogo} alt="Logo" width={60} height={60} className={styles.logo} />
      <div className={styles.team_name}>{teamName}</div>
      <div>
        <div className={styles.captain_info}>
          <Image src={resolvedCaptainPic} alt="Captain" width={40} height={40} className={styles.captain} unoptimized />
          <div>
            <div className={styles.captain_name}>{captainName}</div>
            <div className={styles.captain_role}>captain</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (teamId) {
    return (
      <Link href={`/teams/${teamId}`} className={styles.card_link}>
        {card}
      </Link>
    );
  }

  return card;
};
