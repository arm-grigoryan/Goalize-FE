"use client";

import styles from "./LeaguesHeader.module.css";
import Image from "next/image";
import championsLeagueImg from "../../../public/images/championsLegue.png";
import Button from "@/shared/Button";
import Link from "next/link";
import PopupModal from "@/entities/PopupModal";
import { usePathname } from "next/navigation";
import ChampionCard from "../ChampionCard";
import joinedIcon from '../../assets/pngs/joinedIcon.svg';
import { useLeagueHeader } from "./useLeagueHeader";

export const LeaguesHeader = () => {
  const {
    leagueData,
    isMobile,
    isRegistrationClosed,
    registrationClosedReason,
    isTeamJoined,
    modalState,
    isLoading,
    handleOpenJoinModal,
    handleOpenUnjoinModal,
    handleConfirmAction,
    handleCloseModal,
    formatDate,
    formatPrize,
    leagueId,
  } = useLeagueHeader();

  const pathname = usePathname();
  const base = `/leagues/${leagueId}`;
  console.log(isRegistrationClosed, "isRegistrationClosed");


  const isActive = (href: string) => {
    if (href === base) {
      return pathname === base || pathname === `${base}/groups`;
    }
    return pathname.startsWith(href);
  };

  const winnerLogo =
    leagueData?.winner?.logoUrl &&
      typeof leagueData.winner.logoUrl === "string" &&
      leagueData.winner.logoUrl.startsWith("http")
      ? leagueData.winner.logoUrl
      : undefined;

  const showTitleSection = leagueData && (leagueData.state !== "Registration" || leagueData.firstPlacePrize || leagueData.secondPlacePrize || leagueData.semiFinalistPrize || leagueData.paymentPerGame);

  const renderPrizePool = () => (
    <div className={isMobile ? styles.fee_container : styles.fee_container}>
      <div className={isMobile ? styles.total_value_mobile : styles.total_value}>
        {!isMobile && <div className={styles.fee_Title}>Prize Pool</div>}
        {isMobile && <div className={styles.fee_Title}>Prize Pool</div>}

        {leagueData?.firstPlacePrize && (
          <div className={styles.placePrize_container}>
            <div className={styles.placePrize_text}>1st place prize</div>
            <div className={styles.placePrize}>֏ {formatPrize(leagueData.firstPlacePrize)}</div>
          </div>
        )}
        {leagueData?.secondPlacePrize && (
          <div className={styles.placePrize_container}>
            <div className={styles.placePrize_text}>2nd place prize</div>
            <div className={styles.placePrize}>֏ {formatPrize(leagueData.secondPlacePrize)}</div>
          </div>
        )}
        {leagueData?.semiFinalistPrize && (
          <div className={styles.placePrize_container}>
            <div className={styles.placePrize_text}>3rd place prize</div>
            <div className={styles.placePrize}>֏ {formatPrize(leagueData.semiFinalistPrize)}</div>
          </div>
        )}
      </div>

      {leagueData?.paymentPerGame && (
        <div className={isMobile ? styles.per_value_container_mobile : styles.per_value_container}>
          <div className={styles.per_value}>֏ {formatPrize(leagueData.paymentPerGame)}</div>
          <div className={styles.valu_text}>/per game /per team</div>
          {isRegistrationClosed && (
            <div className={styles.registration_closed_reason}>
              You can no longer register <br />
              {registrationClosedReason}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderJoinButton = () => {
    if (leagueData?.state === "Registration" && isRegistrationClosed) return null;

    if (isTeamJoined) {
      return (
        <div
          className={leagueData?.state === "Playing" || leagueData?.state === "Finished" ? styles.disabled_button : ""}
          onClick={leagueData?.state === "Registration" ? handleOpenUnjoinModal : undefined}
        >
          <div className={styles.joinedButton}>
            <div className={styles.joinedButtonWrapper}>
              <Image className={styles.joinedButtonIcon} src={joinedIcon} alt="" />
              <div className={styles.stageButtonName}>{leagueData?.state === "Playing" ? "Joined" : "Joined"}</div>
            </div>
          </div>
        </div>
      );
    }

    if (leagueData?.state === "Registration") {
      return (
        <Button
          content="Join League"
          className="red_button_transparant_white_text"
          handleClick={handleOpenJoinModal}
        />
      );
    }

    return null;
  };

  return (
    <div className={styles.leagues_header}>
      {/* Registration Badge logic */}
      {leagueData?.state === "Registration" && !isRegistrationClosed && (
        <div className={styles.badge}>Join League</div>
      )}
      {isRegistrationClosed && (
        <div className={styles.registration_closed_badge}>Registration Closed</div>
      )}

      {/* Main Content */}
      <div className={styles.leagues_header_inner}>
        {isMobile ? (
          <>
            <div className={styles.league_name_container_mobile}>
              <Image src={championsLeagueImg} alt="champions league" />
              <div className={styles.league_name_and_button}>
                <div className={styles.league_name}>{leagueData?.name}</div>
                {/* Only show state button if NOT in finished state (design choice based on original code, but requirements say winner card) */}
                {leagueData?.state !== "Finished" && (
                  <div className={styles.stageButton}>
                    <div className={styles.stageButtonWrapper}>
                      <div className={styles.stageButtonName}> State: </div>
                      <div className={styles.stage}>{leagueData?.state}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.registration_closed_container_mobile}>
              {leagueData?.state !== "Finished" ? (
                <>
                  {renderPrizePool()}
                  <div className={styles.buttonTextWrapper}>
                    {renderJoinButton()}
                    {!isRegistrationClosed && leagueData?.state === "Registration" && (
                      <p className={styles.registration_closed_text_mobile}>
                        Registrations will be closed on{" "}
                        {leagueData && <span>{formatDate(leagueData.registrationDate)}</span>}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className={styles.winner_prize_container}>
                  <ChampionCard teamName={leagueData?.winner?.name} logoSrc={winnerLogo} />
                  {renderPrizePool()}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles.league_name_container}>
              <Image src={championsLeagueImg} alt="champions league" />
              <div className={styles.league_name_and_button}>
                <div className={styles.league_name}>{leagueData?.name}</div>
                {renderJoinButton()}
                <div className={styles.stageButton}>
                  <div className={styles.stageButtonWrapper}>
                    <div className={styles.stageButtonName}> State: </div>
                    <div className={styles.stage}>{leagueData?.state}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.registration_closed_container}>
              {leagueData?.state === "Finished" ? (
                <div className={styles.winner_prize_container}>
                  <ChampionCard teamName={leagueData?.winner?.name} logoSrc={winnerLogo} />
                  {renderPrizePool()}
                </div>
              ) : (
                <>
                  {renderPrizePool()}
                  {!isRegistrationClosed && leagueData?.state === "Registration" && (
                    <p className={styles.registration_closed_text}>
                      Registrations will be closed on{" "}
                      {leagueData && <span>{formatDate(leagueData.registrationDate)}</span>}
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Navigation Links */}
      {leagueData?.state === "Registration" ? (
        <div className={styles.links}>
          <Link
            href={`${base}`}
            className={`${styles.link} ${isActive(`${base}`) ? styles.selected : ""}`}
          >
            Teams
          </Link>
        </div>
      ) : (
        <div className={styles.links}>
          <Link
            href={base}
            className={`${styles.link} ${isActive(base) ? styles.selected : ""}`}
          >
            Groups
          </Link>
          <Link
            href={`${base}/drawStandings`}
            className={`${styles.link} ${isActive(`${base}/drawStandings`) ? styles.selected : ""}`}
          >
            Draw Standings
          </Link>
          <Link
            href={`${base}/results`}
            className={`${styles.link} ${isActive(`${base}/results`) ? styles.selected : ""}`}
          >
            Results
          </Link>
          <Link
            href={`${base}/fixtures`}
            className={`${styles.link} ${isActive(`${base}/fixtures`) ? styles.selected : ""}`}
          >
            Fixtures
          </Link>
          <Link
            href={`${base}/stats`}
            className={`${styles.link} ${isActive(`${base}/stats`) ? styles.selected : ""}`}
          >
            Stats
          </Link>
        </div>
      )}

      {/* Modals and Loading */}
      {isLoading && (
        <div className={styles.loading_overlay}>
          {/* Using a simple spinner or loading text, assuming no global loader component available immediately */}
          <div style={{ color: 'white' }}>Loading...</div>
        </div>
      )}

      {modalState.open && modalState.type !== "error" && modalState.type !== "success" ? (
        <PopupModal
          open={modalState.open}
          onClose={handleCloseModal}
          title={modalState.title}
          description={modalState.description}
          buttonContent="Confirm"
          hasCloseButton
          onButtonClick={handleConfirmAction}
        />
      ) : null}

      {modalState.open && (modalState.type === "error" || modalState.type === "success") ? (
        <PopupModal
          open={modalState.open}
          onClose={handleCloseModal}
          title={modalState.title}
          description={modalState.description}
          buttonContent="Close"
          onButtonClick={handleCloseModal}
        />
      ) : null}

    </div>
  );
};
