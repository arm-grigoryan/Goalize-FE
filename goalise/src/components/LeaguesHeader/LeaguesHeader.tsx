"use client";

import styles from "./LeaguesHeader.module.css";
import Image from "next/image";
import championsLeagueImg from "../../../public/images/championsLegue.png";
import Button from "@/shared/Button";
import { useState } from "react";
import Link from "next/link";
import PopupModal from "@/entities/PopupModal";

export const LeaguesHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className={styles.leagues_header}>
      <div className={styles.leagues_header_inner}>
        <div className={styles.league_name_container}>
          <div>
            <Image src={championsLeagueImg} alt="champions league" />
          </div>
          <div className={styles.league_name_and_button}>
            <div className={styles.league_name}>champions league</div>
            <Button
              content="Join League"
              className="red_button_transparant_white_text"
              handleClick={() => {
                setOpenModal(true);
              }}
            />
          </div>
        </div>
        <div className={styles.registration_closed_container}>
          <p className={styles.registration_closed_text}>
            Registrations will be closed on <span>19/04/2025</span>
          </p>
        </div>
      </div>
      <div className={styles.links}>
        <Link className={styles.link} href="/leagues">
          Groups
        </Link>
        <Link className={styles.link} href="/leagues/drawStandings">
          Draw Standings
        </Link>
        <Link className={styles.link} href="/leagues/fixtures">
          Fixtures
        </Link>
        <Link className={styles.link} href="/leagues/stats">
          Stats
        </Link>
      </div>

      {openModal && (
        <PopupModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Join League"
          description="Are you sure you want to join this league?"
          buttonContent="Join"
          hasCloseButton={true}
        />
      )}
    </div>
  );
};
