"use client";

import Link from "next/link";
import React, { useCallback, useState } from "react";
import styles from "./TeamOverviewHeader.module.css";
import Image from "next/image";
import Button from "@/shared/Button";
import teamLogoFallback from "../../assets/pngs/teamLogo.png";
import infoIcon from "../../assets/pngs/infoIcon.svg";
import playerFallback from "../../assets/pngs/unassigned.png";
import edit from "../../assets/pngs/edit.svg";
import { useParams, usePathname } from "next/navigation";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import {
  useGetTeamInfoQuery,
  useGetUserInfoQuery,
  useQuitTeamMutation,
  useApplyToTeamMutation,
} from "@/app/store/services/api";
import { useAuth } from "@/shared/auth/AuthContext";
import { refreshTokens } from "@/shared/auth/oidcService";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import PendingActionLabel from "@/entities/PendingActionLabel";
import { UpdateTeamPopUp } from "@/entities/UpdateTeamPopUp/UpdateTeamPopUp";
import { useTranslations } from "next-intl";
import ProgressBar from "@/shared/ProgressBar";
import CustomDivider from "@/shared/Divider";

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidBirthDate = (bd: string): boolean =>
  !bd.startsWith("0001-01-01") && !bd.startsWith("1970-01-01T00:00:00");

const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

export const TeamOverviewHeader: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const { isAuthenticated, signIn, tokens } = useAuth();
  const { teamId } = useParams();
  const pathname = usePathname();
  const id = Number(teamId);
  const base = `/teams/${teamId}`;
  const tTeams = useTranslations("teams");
  const t = useTranslations("teamOverview.header");
  const tModals = useTranslations("playerProfile.modals");
  const tCommon = useTranslations("common");
  const tDraft = useTranslations("draftTeam");

  const {
    data: teamInfo,
    isLoading,
    isError,
    refetch: refetchTeamInfo,
  } = useGetTeamInfoQuery(id, {
    skip: !id,
  });

  const {
    data: userInfo,
    isLoading: isUserInfoLoading,
    refetch: refetchUserInfo,
  } = useGetUserInfoQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [quitTeamMutation, { isLoading: isQuitting }] = useQuitTeamMutation();
  const [applyToTeamMutation, { isLoading: isApplying }] =
    useApplyToTeamMutation();

  const [showQuitConfirmModal, setShowQuitConfirmModal] = useState(false);
  const [showQuitSuccessModal, setShowQuitSuccessModal] = useState(false);
  const [showQuitErrorModal, setShowQuitErrorModal] = useState(false);
  const [quitTeamError, setQuitTeamError] = useState<string | null>(null);

  const [showApplyConfirmModal, setShowApplyConfirmModal] = useState(false);
  const [showApplySuccessModal, setShowApplySuccessModal] = useState(false);
  const [showApplyErrorModal, setShowApplyErrorModal] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [showCaptainWarningModal, setShowCaptainWarningModal] = useState(false);

  const [showUpdatePopUp, setShowUpdatePopUp] = useState(false);
  const [hasQuit, setHasQuit] = useState(false);

  const userTeamId = userInfo?.playerInfo?.team?.id;
  const userId = userInfo?.playerInfo?.id;

  const isAbandoned = teamInfo?.status === "Abandoned";

  const isOnThisTeam =
    !hasQuit && isAuthenticated && Number(userTeamId) === Number(id);

  const isCaptain =
    isAuthenticated &&
    userId !== undefined &&
    teamInfo?.team.captainId !== undefined &&
    Number(userId) === Number(teamInfo.team.captainId);

  const isUserCaptainOfOwnTeam =
    isAuthenticated &&
    userId !== undefined &&
    userInfo?.playerInfo?.team?.captainId !== undefined &&
    Number(userId) === Number(userInfo.playerInfo.team.captainId);

  const showApplyButton =
    !isAuthenticated ||
    (isAuthenticated && !isUserInfoLoading && !isOnThisTeam);

  const isAlreadyApplied = Boolean(
    isAuthenticated &&
      userInfo?.relationshipState?.pendingAppliedTeamIds?.includes(id),
  );

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }
    if (isUserCaptainOfOwnTeam) {
      setShowCaptainWarningModal(true);
      return;
    }
    setShowApplyConfirmModal(true);
  };

  const applyToTeam = useCallback(async () => {
    try {
      await applyToTeamMutation({ teamId: id }).unwrap();
      setShowApplySuccessModal(true);
      refetchUserInfo();
      refetchTeamInfo();
    } catch (error) {
      const errorData = error as { data?: { errorMessage?: string } };
      setApplyError(
        errorData?.data?.errorMessage ||
          t("unexpectedError"),
      );
      setShowApplyErrorModal(true);
    }
  }, [id, applyToTeamMutation, refetchUserInfo, refetchTeamInfo, t]);

  const quitTeam = useCallback(async () => {
    if (!userTeamId) return;
    try {
      await quitTeamMutation({ teamId: userTeamId }).unwrap();
      if (isCaptain && tokens?.refreshToken) {
        try {
          await refreshTokens(tokens.refreshToken);
        } catch {}
      }
      setHasQuit(true);
      setShowQuitSuccessModal(true);
      refetchUserInfo();
      refetchTeamInfo();
    } catch (error) {
      const errorData = error as { data?: { errorMessage?: string } };
      setQuitTeamError(
        errorData?.data?.errorMessage ||
          t("unexpectedError"),
      );
      setShowQuitErrorModal(true);
    }
  }, [
    userTeamId,
    isCaptain,
    quitTeamMutation,
    tokens?.refreshToken,
    refetchUserInfo,
    refetchTeamInfo,
    setHasQuit,
    t,
  ]);

  const isActive = (href: string) => {
    if (href === base) return pathname === base;
    return pathname.startsWith(href);
  };

  const captainFullName = teamInfo
    ? `${teamInfo.captain.firstName} ${teamInfo.captain.lastName}`
    : "";

  const captainAge =
    teamInfo?.captain.birthDate && isValidBirthDate(teamInfo.captain.birthDate)
      ? calculateAge(teamInfo.captain.birthDate)
      : null;

  const captainPhotoSrc =
    teamInfo?.captain.profilePic && isValidUrl(teamInfo.captain.profilePic)
      ? teamInfo.captain.profilePic
      : playerFallback;

  const teamLogoSrc =
    teamInfo?.team.logoUrl && isValidUrl(teamInfo.team.logoUrl)
      ? teamInfo.team.logoUrl
      : teamLogoFallback;

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.inner}>
        {/* Left: team logo + name + buttons */}
        <div className={styles.name_container}>
          {isLoading ? (
            <div
              className={styles.skeleton}
              style={{ width: 130, height: 130, borderRadius: 8 }}
            />
          ) : (
            <Image
              src={teamLogoSrc}
              alt={teamInfo?.team.name ?? ""}
              className={styles.teamLogo}
              width={130}
              height={130}
              unoptimized
            />
          )}

          <div className={styles.name_and_button}>
            <div className={styles.nameWrapper}>
              {isLoading ? (
                <div
                  className={styles.skeleton}
                  style={{ width: 200, height: 32, borderRadius: 6 }}
                />
              ) : isError ? (
                <div className={styles.errorText}>{tTeams("failedToLoad")}</div>
              ) : (
                <div className={styles.name}>
                  {teamInfo?.team.name}
                  {teamInfo?.team.abbreviation && (
                    <span className={styles.abbreviation}>
                      {" "}
                      ({teamInfo.team.abbreviation})
                    </span>
                  )}
                </div>
              )}
              {!isMobile && !isAbandoned && isCaptain && (
                <div
                  className={styles.editButton}
                  onClick={() => setShowUpdatePopUp(true)}
                  style={{ cursor: "pointer" }}
                >
                  <Image src={edit} alt="" />
                </div>
              )}
            </div>

            <div className={styles.buttonsWrapper}>
              {isAbandoned ? (
                <div className={styles.abandoned}>
                  <Image src={infoIcon} alt="" />
                  <div className={styles.abandonedText}>{t("abandoned")}</div>
                </div>
              ) : (
                <>
                  {showApplyButton &&
                    (isAlreadyApplied ? (
                      <PendingActionLabel
                        text={tTeams("appliedLabelText")}
                        tooltipText={tTeams("appliedTooltip")}
                      />
                    ) : (
                      <Button
                        handleClick={handleApplyClick}
                        content={t("applyButton")}
                        className="red_button_transparant_white_text"
                      />
                    ))}
                  {isOnThisTeam && (
                    <Button
                      handleClick={() => setShowQuitConfirmModal(true)}
                      content={t("quitButton")}
                      className="red_button_transparant_white_text"
                    />
                  )}
                  {isMobile && isCaptain && (
                    <div
                      className={styles.editButton}
                      onClick={() => setShowUpdatePopUp(true)}
                      style={{ cursor: "pointer" }}
                    >
                      <Image src={edit} alt="" />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <ProgressBar
          wins={teamInfo?.stats.win ?? 0}
          draws={teamInfo?.stats.draw ?? 0}
          losses={teamInfo?.stats.lose ?? 0}
        />
        <CustomDivider orientation="horizontal" flexItem/>
        {/* Right: captain info + photo — skeleton */}
        {isLoading && (
          <div className={styles.infoImageWrapper}>
            <div className={styles.nameButtonWrapper}>
              <div
                className={styles.skeleton}
                style={{ width: 180, height: 36, borderRadius: 6 }}
              />
              <div className={styles.buttonsWrapper}>
                <div
                  className={styles.skeleton}
                  style={{ width: 80, height: 40, borderRadius: 10 }}
                />
                <div
                  className={styles.skeleton}
                  style={{ width: 80, height: 40, borderRadius: 10 }}
                />
                <div
                  className={styles.skeleton}
                  style={{ width: 90, height: 40, borderRadius: 10 }}
                />
              </div>
            </div>
            <div
              className={styles.skeleton}
              style={{ width: 173, height: 221, borderRadius: 14 }}
            />
          </div>
        )}
        {/* Right: captain info + photo — real data */}
        {!isLoading && teamInfo && (
          <div className={styles.infoImageWrapper}>
            <div className={styles.nameButtonWrapper}>
              <Link
                href={`/profile/${teamInfo.team.captainId}`}
                style={{ textDecoration: "none" }}
              >
                <div className={styles.playerName}>
                  {captainFullName}
                  {!isCaptain && (
                    <div className={styles.captainLabel}> {tDraft("captainLabel")} </div>
                  )}
                </div>
              </Link>
              <div className={styles.buttonsWrapper}>
                {captainAge !== null && (
                  <div className={styles.button}>
                    <span>{t("ageLabel")} </span>
                    {captainAge}
                  </div>
                )}
                {teamInfo.captain.workingFoot && (
                  <div className={styles.button}>
                    <span>{t("footLabel")} </span>
                    {teamInfo.captain.workingFoot}
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/profile/${teamInfo.team.captainId}`}
              style={{ textDecoration: "none" }}
            >
              <Image
                src={captainPhotoSrc}
                alt={captainFullName}
                className={styles.playerImage}
                width={173}
                height={221}
                unoptimized
              />
            </Link>
          </div>
        )}
      </div>

      {/* Navigation tabs */}
      <div className={styles.links}>
        <Link
          href={base}
          className={`${styles.link} ${isActive(base) ? styles.selected : ""}`}
        >
          {t("tabs.overview")}
        </Link>
        <Link
          href={`${base}/results`}
          className={`${styles.link} ${isActive(`${base}/results`) ? styles.selected : ""}`}
        >
          {t("tabs.results")}
        </Link>
        <Link
          href={`${base}/fixtures`}
          className={`${styles.link} ${isActive(`${base}/fixtures`) ? styles.selected : ""}`}
        >
          {t("tabs.fixtures")}
        </Link>
        <Link
          href={`${base}/transfers`}
          className={`${styles.link} ${isActive(`${base}/transfers`) ? styles.selected : ""}`}
        >
          {t("tabs.transfers")}
        </Link>
        <Link
          href={`${base}/squad`}
          className={`${styles.link} ${isActive(`${base}/squad`) ? styles.selected : ""}`}
        >
          {t("tabs.squad")}
        </Link>
      </div>

      {/* Apply modals */}
      {showApplyConfirmModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowApplyConfirmModal(false)}
          title={t("teamApplicationTitle")}
          description={t("teamApplicationDescription", {
            teamName: teamInfo?.team.name ?? t("thisTeamFallback"),
          })}
          confirmButtonText={tCommon("confirm")}
          onConfirmButtonClick={() => {
            setShowApplyConfirmModal(false);
            applyToTeam();
          }}
          cancelButtonText={tCommon("cancel")}
        />
      )}
      {showApplySuccessModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowApplySuccessModal(false)}
          title={t("applicationSentTitle")}
          description={t("applicationSentDescription")}
          cancelButtonText={tCommon("close")}
        />
      )}
      {showApplyErrorModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowApplyErrorModal(false)}
          title={t("cannotApplyTitle")}
          description={applyError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
        />
      )}
      {showCaptainWarningModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowCaptainWarningModal(false)}
          title={tModals("actionNotAllowed")}
          description={t("captainWarningDescription")}
          cancelButtonText={tCommon("close")}
        />
      )}

      {/* Quit modals */}
      {showQuitConfirmModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowQuitConfirmModal(false)}
          title={tModals("quitTeamTitle")}
          description={tModals("quitTeamDescription")}
          confirmButtonText={tCommon("confirm")}
          onConfirmButtonClick={() => {
            setShowQuitConfirmModal(false);
            quitTeam();
          }}
          cancelButtonText={tCommon("cancel")}
        />
      )}
      {showQuitSuccessModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowQuitSuccessModal(false)}
          title={tModals("quitSuccessTitle")}
          description={
            isCaptain
              ? t("quitTeamAbandonedDescription")
              : tModals("quitSuccessDescription")
          }
          cancelButtonText={tCommon("close")}
        />
      )}
      {showQuitErrorModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowQuitErrorModal(false)}
          title={tModals("cannotQuitTeam")}
          description={quitTeamError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
        />
      )}

      {(isQuitting || isApplying) && (
        <div className={styles.loader_container}>
          <div className={styles.loader}></div>
        </div>
      )}

      {teamInfo && (
        <UpdateTeamPopUp
          open={showUpdatePopUp}
          onClose={() => {
            setShowUpdatePopUp(false);
            refetchTeamInfo();
          }}
          teamId={id}
          initialName={teamInfo.team.name}
          initialAbbreviation={teamInfo.team.abbreviation}
          initialLogoUrl={teamInfo.team.logoUrl}
        />
      )}
    </div>
  );
};
