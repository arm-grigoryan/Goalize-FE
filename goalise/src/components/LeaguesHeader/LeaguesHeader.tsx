"use client";

import styles from "./LeaguesHeader.module.css";
import Image from "next/image";
import championsLeagueImg from "../../../public/images/championsLegue.png";
import Button from "@/shared/Button";
import { useState } from "react";
import Link from "next/link";
import PopupModal from "@/entities/PopupModal";
import { useParams } from "next/navigation";
import { useGetLeaguesQuery } from "@/app/store/services/api";

export const LeaguesHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data } = useGetLeaguesQuery();
  const { leagueId } = useParams();
  const league = data?.find((league) => league.id === Number(leagueId));
  console.log(league, "league data in header");

  return (
    <div className={styles.leagues_header}>
      <div className={styles.leagues_header_inner}>
        <div className={styles.league_name_container}>
          <div>
            <Image src={championsLeagueImg} alt="champions league" />
          </div>
          <div className={styles.league_name_and_button}>
            <div className={styles.league_name}>{league?.name}</div>
            {league?.state === "Registration" && (
              <Button
                content="Join League"
                className="red_button_transparant_white_text"
                handleClick={() => {
                  setOpenModal(true);
                }}
              />
            )}
          </div>
        </div>
        <div className={styles.registration_closed_container}>
          <p className={styles.registration_closed_text}>
            Registrations will be closed on{" "}
            <span>{league?.registrationDate}</span>
          </p>
        </div>
      </div>
      {league?.state === "Registration" ? (
        <div className={styles.links}>
          <Link className={styles.link} href="#">
            Teams
          </Link>
        </div>
      ) : (
        <div className={styles.links}>
          <Link className={styles.link} href={`/leagues/${leagueId}`}>
            Groups
          </Link>
          <Link
            className={styles.link}
            href={`/leagues/${leagueId}/drawStandings`}
          >
            Draw Standings
          </Link>
          <Link className={styles.link} href={`/leagues/${leagueId}/results`}>
            Results
          </Link>
          <Link className={styles.link} href={`/leagues/${leagueId}/fixtures`}>
            Fixtures
          </Link>
          <Link className={styles.link} href={`/leagues/${leagueId}/stats`}>
            Stats
          </Link>
        </div>
      )}

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
