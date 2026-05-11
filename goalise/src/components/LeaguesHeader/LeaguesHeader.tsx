"use client";

import styles from "./LeaguesHeader.module.css";
import Image from "next/image";
import Button from "@/shared/Button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ChampionCard from "../ChampionCard";
import joinedIcon from "../../assets/pngs/joinedIcon.svg";
import { useLeagueHeader } from "./useLeagueHeader";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { NotificationPopUp } from "@/entities/NotificationPopUp/NotificationPopUp";
import { useTranslations } from "next-intl";

export const LeaguesHeader = () => {
  const t = useTranslations("leagues.header");
  const tCommon = useTranslations("common");
  const {
    leagueData,
    isMobile,
    isRegistrationClosed,
    registrationClosedReason,
    isTeamJoined,
    modalState,
    isLoading,
    serverError,
    clearServerError,
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

  const leagueLogo = leagueData?.logoUrl!;

  const renderPrizePool = () => (
    <div className={isMobile ? styles.fee_container : styles.fee_container}>
      {(leagueData?.firstPlacePrize || leagueData?.secondPlacePrize || leagueData?.semiFinalistPrize) &&
        <div
          className={isMobile ? styles.total_value_mobile : styles.total_value}
        >
          {!isMobile && <div className={styles.fee_Title}>{t("prizePool")}</div>}
          {isMobile && <div className={styles.fee_Title}>{t("prizePool")}</div>}

          <div className={styles.placePrize_container}>
            {leagueData?.firstPlacePrize && (
              <div className={styles.prizeContainer}>
                <div className={styles.placePrize_text}>{t("firstPlace")}</div>
                <div className={styles.placePrize}>
                  ֏ {formatPrize(leagueData.firstPlacePrize)}
                </div>
              </div>
            )}
            {leagueData?.secondPlacePrize && (
              <div className={styles.prizeContainer}>
                <div className={styles.placePrize_text}>{t("secondPlace")}</div>
                <div className={styles.placePrize}>
                  ֏ {formatPrize(leagueData.secondPlacePrize)}
                </div>
              </div>
            )}

            {leagueData?.semiFinalistPrize && (
              <div className={styles.prizeContainer}>
                <div className={styles.placePrize_text}>{t("semiFinalist")}</div>
                <div className={styles.placePrize}>
                  ֏ {formatPrize(leagueData.semiFinalistPrize)}
                </div>
              </div>
            )}
          </div>
        </div>
      }
      {
        leagueData?.state !== "Finished" &&
        leagueData?.paymentPerGame && (
          <div
            className={
              isMobile
                ? styles.per_value_container_mobile
                : styles.per_value_container
            }
          >
            <div className={styles.per_value}>
              ֏ {formatPrize(leagueData.paymentPerGame)}
            </div>
            <div className={styles.valu_text}>{t("perGamePerTeam")}</div>
            {isRegistrationClosed && (
              <div className={styles.registration_closed_reason}>
                {t("canNoLongerRegister")} <br />
                {registrationClosedReason}
              </div>
            )}
          </div>
        )
      }
    </div >
  );

  const renderJoinButton = () => {
    if (isTeamJoined) {
      return (
        <div
          className={
            leagueData?.state === "Playing" || leagueData?.state === "Finished"
              ? styles.disabled_button
              : ""
          }
          onClick={
            leagueData?.state === "Registration"
              ? handleOpenUnjoinModal
              : undefined
          }
        >
          <div className={styles.joinedButton}>
            <div className={styles.joinedButtonWrapper}>
              <Image
                className={styles.joinedButtonIcon}
                src={joinedIcon}
                alt=""
              />
              <div className={styles.stageButtonName}>
                {t("joined")}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (leagueData?.state === "Registration" && !isRegistrationClosed) {
      return (
        <Button
          content={t("joinLeague")}
          className="red_button_transparant_white_text"
          handleClick={handleOpenJoinModal}
        />
      );
    }

    return null;
  };

  return (
    <div className={styles.leagues_header}>
      {isRegistrationClosed && (
        <div className={styles.badge}>
          {t("registrationClosed")}
        </div>
      )}

      {/* Main Content */}
      <div className={styles.leagues_header_inner}>
        {isMobile ? (
          <>
            <div className={styles.league_name_container_mobile}>
              <Image src={leagueLogo} alt="champions league" width={80} height={80} />
              <div className={styles.league_name_and_button}>
                <div className={styles.league_name}>{leagueData?.name}</div>
                <div className={styles.stageButton}>
                  <div className={styles.stageButtonWrapper}>
                    <div className={styles.stageButtonName}> {t("state")} </div>
                    <div className={styles.stage}>{leagueData?.state}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.registration_closed_container_mobile}>
              {leagueData?.state !== "Finished" ? (
                <>
                  {renderPrizePool()}
                  <div className={styles.buttonTextWrapper}>
                    <div className={styles.joinWrapper}>{renderJoinButton()} </div>
                    {!isRegistrationClosed &&
                      leagueData?.state === "Registration" && (
                        <p className={styles.registration_closed_text_mobile}>
                          {t("registrationsWillBeClosedOn")}{" "}
                          {leagueData && (
                            <span>
                              {formatDate(leagueData.registrationDate)}
                            </span>
                          )}
                        </p>
                      )}
                  </div>
                </>
              ) : (
                <div className={styles.winner_prize_container}>
                  <ChampionCard
                    teamName={leagueData?.winner?.name}
                    logoSrc={winnerLogo}
                    teamId={leagueData?.winner?.id}
                  />
                  {renderPrizePool()}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className={styles.league_name_container}>
              <Image src={leagueLogo} alt="champions league" width={80} height={80} />
              <div className={styles.league_name_and_button}>
                <div className={styles.league_name}>{leagueData?.name}</div>
                {renderJoinButton()}
                <div className={styles.stageButton}>
                  <div className={styles.stageButtonWrapper}>
                    <div className={styles.stageButtonName}> {t("state")} </div>
                    <div className={styles.stage}>{leagueData?.state}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.registration_closed_container}>
              {leagueData?.state === "Finished" ? (
                <div className={styles.winner_prize_container}>
                  <ChampionCard
                    teamName={leagueData?.winner?.name}
                    logoSrc={winnerLogo}
                    teamId={leagueData?.winner?.id}
                  />
                  {renderPrizePool()}
                </div>
              ) : (
                <>
                  {renderPrizePool()}
                  {!isRegistrationClosed &&
                    leagueData?.state === "Registration" && (
                      <p className={styles.registration_closed_text}>
                        {t("registrationsWillBeClosedOn")}{" "}
                        {leagueData && (
                          <span>{formatDate(leagueData.registrationDate)}</span>
                        )}
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
            className={`${styles.link} ${isActive(`${base}`) ? styles.selected : ""
              }`}
          >
            {t("joinedTeams")}
          </Link>
        </div>
      ) : (
        <div className={styles.links}>
          <Link
            href={base}
            className={`${styles.link} ${isActive(base) ? styles.selected : ""
              }`}
          >
            {t("tabs.groups")}
          </Link>
          <Link
            href={`${base}/drawStandings`}
            className={`${styles.link} ${isActive(`${base}/drawStandings`) ? styles.selected : ""
              }`}
          >
            {t("tabs.drawStandings")}
          </Link>
          <Link
            href={`${base}/results`}
            className={`${styles.link} ${isActive(`${base}/results`) ? styles.selected : ""
              }`}
          >
            {t("tabs.results")}
          </Link>
          <Link
            href={`${base}/fixtures`}
            className={`${styles.link} ${isActive(`${base}/fixtures`) ? styles.selected : ""
              }`}
          >
            {t("tabs.fixtures")}
          </Link>
          <Link
            href={`${base}/stats`}
            className={`${styles.link} ${isActive(`${base}/stats`) ? styles.selected : ""
              }`}
          >
            {t("tabs.stats")}
          </Link>
        </div>
      )}

      {/* Modals and Loading */}
      {isLoading && (
        <div className={styles.loader_container}>
          <div className={styles.loader}></div>
        </div>
      )}

      {modalState.open &&
        modalState.type !== "error" &&
        modalState.type !== "success" ? (
        <PlayerInvitationCard
          description={modalState.description}
          title={modalState.title}
          onCancelButtonClick={handleCloseModal}
          onConfirmButtonClick={handleConfirmAction}
          confirmButtonText={tCommon("confirm")}
          cancelButtonText={tCommon("cancel")}
        />
      ) : null}

      {modalState.open &&
        (modalState.type === "error" || modalState.type === "success") ? (
        <PlayerInvitationCard
          onCancelButtonClick={handleCloseModal}
          description={modalState.description}
          title={modalState.title}
          cancelButtonText={tCommon("close")}
        />
      ) : null}

      {serverError && (
        <div className={styles.toastWrapper} onClick={clearServerError}>
          <NotificationPopUp
            title={t("serverError")}
            description={serverError}
          />
        </div>
      )}
    </div>
  );
};
