"use client";
import styles from "./PlayerProfileCard.module.css";
import { IPlayerProfileProps } from "@/entities/PlayerProfileCard/PlayerProfileCard.types";
import Button from "@/shared/Button";
import plusButtonImg from "../../assets/pngs/plusButton.svg";
import noPhoto from "../../assets/pngs/noPhoto.png";
import removeUserIng from "../../assets/pngs/removeUser.svg";
import Image from "next/image";
import Link from "next/link";
import PlayerStatistics from "../PlayerStatistics";
import UnassignedPlayerCard from "../UnassignedPlayerCard";
import PendingActionLabel from "../PendingActionLabel";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { usePlayerProfile } from "@/components/PlayerProfile/usePlayerProfile";

export const PlayerProfileCard: React.FC<IPlayerProfileProps> = ({
  profilePic,
  phoneNumber,
  playerNumber,
  inviteButtonText,
  fullName,
  age,
  foot,
  makeCaptainButtonText,
  isCaptain,
  isSameTeam,
  isViewingSelf,
  onInviteButtonClick,
  onMakeCaptainButtonClick,
  onRemoveUserButtonClick,
  teamLogo,
  teamName,
  quitTeamButtonText,
  onQuitTeamButtonClick,
  playerHasTeam,
  isLoggedIn,
  teamId,
  isAlreadyInvited,
  invitedLabelText,
  invitedTooltipText,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("playerProfile.buttons");
  const { playerId } = useParams();
  const { playerStats } = usePlayerProfile({ playerId: Number(playerId) });

  const showMakeCaptain =
    isLoggedIn &&
    isCaptain &&
    isSameTeam &&
    !isViewingSelf &&
    !!onMakeCaptainButtonClick &&
    !!makeCaptainButtonText;

  const showRemoveUser =
    isLoggedIn &&
    !!teamName &&
    !!onRemoveUserButtonClick &&
    isCaptain &&
    isSameTeam &&
    !isViewingSelf;

  const showActionButtons = showMakeCaptain || showRemoveUser;

  return (
    <div
      className={`${styles.container} ${isMobile ? styles.mobile : ""}`}
    >
      <div className={styles.leftContainer}>
        <div className={styles.playerContainer}>
          <div className={styles.imageWrapper}>
            <Image
              src={typeof profilePic === "string" && profilePic.startsWith("http") ? profilePic : noPhoto}
              className={styles.image}
              alt={""}
              width={260}
              height={350}
              unoptimized={typeof profilePic === "string" && profilePic.startsWith("http")}
            />
            {isMobile && showActionButtons && (
              <div className={styles.buttonsContainer}>
                {showMakeCaptain && (
                  <Button
                    className="white_button_transparent"
                    handleClick={onMakeCaptainButtonClick}
                    content={makeCaptainButtonText}
                  />
                )}
                {showRemoveUser && (
                  <Button
                    className="white_icon_button"
                    icon={removeUserIng}
                    iconHeight={12}
                    iconWidth={12}
                    handleClick={onRemoveUserButtonClick}
                  />
                )}
              </div>
            )}
          </div>
          <div className={styles.infoButtonPart}>
            <div className={styles.imageInfoContainer}>
              <div className={styles.playerInfoContainer}>
                {!isMobile &&
                  (!isSameTeam || !playerHasTeam) &&
                  !isViewingSelf &&
                  (isAlreadyInvited
                    ? invitedLabelText && (
                        <PendingActionLabel
                          text={invitedLabelText}
                          tooltipText={invitedTooltipText ?? ""}
                        />
                      )
                    : onInviteButtonClick &&
                      inviteButtonText && (
                        <Button
                          className="blue_button_transparant"
                          content={inviteButtonText}
                          handleClick={onInviteButtonClick}
                          icon={plusButtonImg}
                        />
                      ))}
                <div className={isMobile ? styles.nameWrapper : ""}>
                  <div className={isMobile ? styles.numberNameWrapper : ""}>
                    {" "}
                    <div className={styles.name}>{fullName}</div>
                    {isMobile && teamName && (
                      <div className={styles.playerNumberContainer}>
                        {playerNumber && (
                          <div className={styles.playerNumber}>
                            {playerNumber}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={isMobile ? styles.wrapper : ""}>
                    <div className={styles.infoButtons}>
                      <div className={styles.button}>
                        {t("age")}: <span> {age} </span>
                      </div>
                      <div className={styles.button}>
                        {t("foot")}: <span> {foot} </span>{" "}
                      </div>
                      {phoneNumber && (
                        <div className={styles.button}>
                          {t("contact")}: <span> {phoneNumber} </span>
                        </div>
                      )}
                    </div>
                    {isMobile &&
                      (!isSameTeam || !playerHasTeam) &&
                      !isViewingSelf &&
                      (isAlreadyInvited
                        ? invitedLabelText && (
                            <PendingActionLabel
                              text={invitedLabelText}
                              tooltipText={invitedTooltipText ?? ""}
                            />
                          )
                        : onInviteButtonClick &&
                          inviteButtonText && (
                            <Button
                              className="blue_button_transparant"
                              content={inviteButtonText}
                              handleClick={onInviteButtonClick}
                              icon={plusButtonImg}
                            />
                          ))}
                  </div>
                </div>
              </div>
            </div>
            {!isMobile && (
              <div className={styles.buttonsContainer}>
                {isLoggedIn ? (
                  <>
                    {isCaptain &&
                      isSameTeam &&
                      !isViewingSelf &&
                      onMakeCaptainButtonClick &&
                      makeCaptainButtonText && (
                        <Button
                          className="red_button_transparant_white_text"
                          handleClick={onMakeCaptainButtonClick}
                          content={makeCaptainButtonText}
                        />
                      )}
                    {teamName &&
                      onRemoveUserButtonClick &&
                      isCaptain &&
                      isSameTeam &&
                      !isViewingSelf && (
                        <Button
                          className="icon_button"
                          icon={removeUserIng}
                          iconHeight={12}
                          iconWidth={12}
                          handleClick={onRemoveUserButtonClick}
                        />
                      )}
                  </>
                ) : null}
              </div>
            )}
            {!playerHasTeam && (
              <div className={styles.unassignedContainer}>
                <UnassignedPlayerCard
                  onClick={
                    isViewingSelf || isAlreadyInvited
                      ? undefined
                      : onInviteButtonClick
                  }
                />
              </div>
            )}
          </div>
          {!isMobile && teamLogo && (
            teamId ? (
              <Link href={`/teams/${teamId}`} className={styles.teamLogoWrapper}>
                <Image src={teamLogo} alt="" className={styles.teamLogo} width={66} height={66} />
              </Link>
            ) : (
              <div className={styles.teamLogoWrapper}>
                <Image src={teamLogo} alt="" className={styles.teamLogo} width={66} height={66} />
              </div>
            )
          )}
          {!isMobile && teamName && (
            <div className={styles.playerNumberContainer}>
              {playerNumber && (
                <div className={styles.playerNumber}>{playerNumber}</div>
              )}
            </div>
          )}
        </div>
        {teamName && (
          <div className={styles.teamContainer}>
            <div className={styles.team}>
              {teamId ? (
                <Link href={`/teams/${teamId}`} className={styles.teamInfo} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
                  {teamLogo && (
                    <Image className={styles.teamImg} alt="" src={teamLogo} width={42} height={42} />
                  )}
                  <div className={styles.teamName}>{teamName}</div>
                </Link>
              ) : (
                <div className={styles.teamInfo}>
                  {teamLogo && (
                    <Image className={styles.teamImg} alt="" src={teamLogo} width={42} height={42} />
                  )}
                  <div className={styles.teamName}>{teamName}</div>
                </div>
              )}
              {isLoggedIn &&
                onQuitTeamButtonClick &&
                quitTeamButtonText &&
                playerHasTeam &&
                isViewingSelf && (
                  <Button
                    className="red_button_transparant_white_text"
                    handleClick={onQuitTeamButtonClick}
                    content={quitTeamButtonText}
                  />
                )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.rightContainer}>
        <PlayerStatistics
          gamesPlayed={playerStats?.gamesPlayed || 0}
          goals={playerStats?.goals || 0}
          assists={playerStats?.assists || 0}
          averageRate={playerStats?.averageRate || 0}
          shots={playerStats?.shots || 0}
          shotsCompleted={playerStats?.shotsCompleted || 0}
          shotAccuracyPercent={playerStats?.shotAccuracyPercent || 0}
          passes={playerStats?.passes || 0}
          passesCompleted={playerStats?.passesCompleted || 0}
          passAccuracyPercent={playerStats?.passAccuracyPercent || 0}
          averageGoalkeeperRate={playerStats?.averageGoalkeeperRate || 0}
          goalsConceded={playerStats?.goalsConceded || 0}
          saves={playerStats?.saves || 0}
          savedPenalties={playerStats?.savedPenalties || 0}
          interceptions={playerStats?.interceptions || 0}
          tackles={playerStats?.tackles || 0}
          redCards={playerStats?.redCards || 0}
          yellowCards={playerStats?.yellowCards || 0}
        />
      </div>
    </div>
  );
};
