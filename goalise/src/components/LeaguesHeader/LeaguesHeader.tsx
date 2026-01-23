"use client";

import styles from "./LeaguesHeader.module.css";
import Image from "next/image";
import championsLeagueImg from "../../../public/images/championsLegue.png";
import Button from "@/shared/Button";
import { useState } from "react";
import Link from "next/link";
import PopupModal from "@/entities/PopupModal";
import { useParams, usePathname } from "next/navigation";
import { useGetLeaguesInfoQuery } from "@/app/store/services/api";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import ChampionCard from "../ChampionCard";
import joinedIcon from '../../assets/pngs/joinedIcon.svg';

export const LeaguesHeader = () => {
  const [openModal, setOpenModal] = useState(false);

  const { leagueId } = useParams();
  const pathname = usePathname();

  const { data } = useGetLeaguesInfoQuery(Number(leagueId));
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  console.log("league data:", data);
  const base = `/leagues/${leagueId}`;

  const isActive = (href: string) => {
    if (href === base) {
      return pathname === base || pathname === `${base}/groups`;
    }
    return pathname.startsWith(href);
  };
 const winnerLogo =
  data?.winner?.logoUrl &&
  typeof data.winner.logoUrl === "string" &&
  data.winner.logoUrl.startsWith("http")
    ? data.winner.logoUrl
    : undefined;

  const formatPrize = (value?: number) =>
  value ? value.toLocaleString("de-DE") : "";


const formatDate = (isoDate: string) => {
  const date = new Date(isoDate);

  const pad = (num: number) => num.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};



  return (
    <div className={styles.leagues_header}>
      <div className={styles.badge}>Join League</div>
      {isMobile ? (
        <div className={styles.leagues_header_inner}>
          <div className={styles.league_name_container_mobile}>
            <Image src={championsLeagueImg} alt="champions league" />
            <div className={styles.league_name_and_button}>
              <div className={styles.league_name}>{data?.name}</div>
            </div>
          </div>

          <div className={styles.registration_closed_container_mobile}>
            {!(data?.state === "Finished") &&  
            <div className={styles.fee_container}>
              <div className={styles.fee_Title}> Prize Pool</div>
              <div className={styles.total_value_mobile}>
               {data?.firstPlacePrize && 
               <div className={styles.placePrize_container}>
                  <div className={styles.placePrize_text}>1st place prize</div>
                  <div className={styles.placePrize}> ֏ {formatPrize(data?.firstPlacePrize)}</div>
                </div>}
                 {data?.secondPlacePrize && 
                 <div className={styles.placePrize_container}>
                  <div className={styles.placePrize_text}>2nd place prize</div>
                  <div className={styles.placePrize}>֏ {formatPrize(data?.secondPlacePrize)} </div>
                </div>}
                 {data?.semiFinalistPrize && 
                 <div className={styles.placePrize_container}>
                  <div className={styles.placePrize_text}>3rd place prize</div>
                  <div className={styles.placePrize}>֏ {formatPrize(data?.semiFinalistPrize)} </div>
                </div>}
              </div>
               {data?.paymentPerGame && 
               <div className={styles.per_value_container_mobile}>
                <div className={styles.per_value}>֏ {formatPrize(data?.paymentPerGame)}</div>
                <div className={styles.valu_text}>/per game /per team </div>
              </div>}
            </div>}
            <div className={styles.buttonTextWrapper}> 
              {data?.state === "Registration" && (
              <Button
                content="Join League"
                className="red_button_transparant_white_text"
                handleClick={() => setOpenModal(true)}
              />
            )}
            <p className={styles.registration_closed_text_mobile}>
              Registrations will be closed on {" "}{ data && <span>{formatDate(data?.registrationDate)}</span>}
            </p>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.leagues_header_inner}>
          <div className={styles.league_name_container}>
            <Image src={championsLeagueImg} alt="champions league" />
            <div className={styles.league_name_and_button}>
              <div className={styles.league_name}>{data?.name}</div>
              {data?.state === "Registration" && (
                <Button
                  content="Join League"
                  className="red_button_transparant_white_text"
                  handleClick={() => setOpenModal(true)}
                />
              )}
              {data?.state === "Registration" && ( 
                <div className={styles.joinedButton}>
                <div className={styles.joinedButtonWrapper}> 
                  <Image className={styles.joinedButtonIcon}  src={joinedIcon} alt=""/>
                  <div className={styles.stageButtonName}>Joined</div>
                </div>
              </div>
              )}
              <div className={styles.stageButton}>
                <div className={styles.stageButtonWrapper}>
                  <div className={styles.stageButtonName}> State: </div>
                  <div className={styles.stage}>{data?.state}</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.registration_closed_container}>
           {data?.state === "Finished" && <ChampionCard teamName={data?.winner.name} logoSrc={winnerLogo} />}
            {!(data?.state === "Finished") &&  
            <div className={styles.fee_container}>
              <div className={styles.total_value}>
                <div className={styles.fee_Title}> Prize Pool</div>
                {data?.firstPlacePrize &&  
                  <div className={styles.placePrize_container}>
                        <div className={styles.placePrize_text}>1st place prize</div>
                        <div className={styles.placePrize}> ֏ {formatPrize(data?.firstPlacePrize)} </div>
                    </div>}
                 {data?.secondPlacePrize && 
                    <div className={styles.placePrize_container}>
                      <div className={styles.placePrize_text}>2nd place prize</div>
                      <div className={styles.placePrize}>֏ {formatPrize(data?.secondPlacePrize)} </div>
                    </div>}
                 {data?.semiFinalistPrize && 
                  <div className={styles.placePrize_container}>
                    <div className={styles.placePrize_text}>3rd place prize</div>
                    <div className={styles.placePrize}>֏ {formatPrize(data?.semiFinalistPrize)}</div>
                  </div>}
              </div>
              {data?.paymentPerGame && 
              <div className={styles.per_value_container}>
                <div className={styles.per_value}>֏ {formatPrize(data?.paymentPerGame)}</div>
                <div className={styles.valu_text}>/per game /per team </div>
              </div>}
            </div>}

            <p className={styles.registration_closed_text}>
              Registrations will be closed on{" "}
             {data && <span>{formatDate(data?.registrationDate)}</span>}
            </p>
          </div>
        </div>
      )}

      {data?.state === "Registration" ? (
        <div className={styles.links}>
          <Link
            href={`${base}`}
            className={`${styles.link} ${
              isActive(`${base}`) ? styles.selected : ""
            }`}
          >
            Teams
          </Link>
        </div>
      ) : (
        <div className={styles.links}>
          <Link
            href={base}
            className={`${styles.link} ${
              isActive(base) ? styles.selected : ""
            }`}
          >
            Groups
          </Link>

          <Link
            href={`${base}/drawStandings`}
            className={`${styles.link} ${
              isActive(`${base}/drawStandings`) ? styles.selected : ""
            }`}
          >
            Draw Standings
          </Link>

          <Link
            href={`${base}/results`}
            className={`${styles.link} ${
              isActive(`${base}/results`) ? styles.selected : ""
            }`}
          >
            Results
          </Link>

          <Link
            href={`${base}/fixtures`}
            className={`${styles.link} ${
              isActive(`${base}/fixtures`) ? styles.selected : ""
            }`}
          >
            Fixtures
          </Link>

          <Link
            href={`${base}/stats`}
            className={`${styles.link} ${
              isActive(`${base}/stats`) ? styles.selected : ""
            }`}
          >
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
          hasCloseButton
        />
      )}
    </div>
  );
};
