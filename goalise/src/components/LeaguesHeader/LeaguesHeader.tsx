"use client";

import styles from "./LeaguesHeader.module.css";
import Image from "next/image";
import championsLeagueImg from "../../../public/images/championsLegue.png";
import Button from "@/shared/Button";
import { useState } from "react";
import Link from "next/link";
import PopupModal from "@/entities/PopupModal";
import { useParams } from "next/navigation";
import { useGetLeaguesInfoQuery } from "@/app/store/services/api";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export const LeaguesHeader = () => {
  const [openModal, setOpenModal] = useState(false);
  const { leagueId } = useParams();
  const { data } = useGetLeaguesInfoQuery(Number(leagueId));
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const date = new Date(data?.registrationDate ?? "").toLocaleDateString();
  return (
    <div className={styles.leagues_header}>
      {isMobile ? (
        <div className={styles.leagues_header_inner}>
          <div className={styles.league_name_container_mobile}>
            <div>
              <Image src={championsLeagueImg} alt="champions league" />
            </div>
            <div className={styles.league_name_and_button}>
              <div className={styles.league_name}>{data?.name}</div>
            </div>
          </div>
          <div className={styles.registration_closed_container_mobile}>
            {data?.state === "Registration" && (
              <Button
                content="Join League"
                className="red_button_transparant_white_text"
                handleClick={() => {
                  setOpenModal(true);
                }}
              />
            )}
            <p className={styles.registration_closed_text_mobile}>
              Registrations will be closed on <span>{date}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className={styles.leagues_header_inner}>
          <div className={styles.league_name_container}>
            <div>
              <Image src={championsLeagueImg} alt="champions league" />
            </div>
            <div className={styles.league_name_and_button}>
              <div className={styles.league_name}>{data?.name}</div>
              {data?.state === "Registration" && (
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
              <span>{data?.registrationDate}</span>
            </p>
          </div>
        </div>
      )}

      {data?.state === "Registration" ? (
        <div className={styles.links}>
          <Link className={styles.link} href={`/leagues/${leagueId}/teams`}>
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
