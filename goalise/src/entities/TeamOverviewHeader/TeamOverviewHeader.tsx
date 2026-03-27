"use client";

import Link from "next/link";
import React, { useCallback, useState } from "react";
import styles from "./TeamOverviewHeader.module.css";
import Image from "next/image";
import Button from "@/shared/Button";
import teamLogoFallback from "../../assets/pngs/teamLogo.png";
import infoIcon from '../../assets/pngs/infoIcon.svg';
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
import { UpdateTeamPopUp } from "@/entities/UpdateTeamPopUp/UpdateTeamPopUp";

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

  const userTeamId = userInfo?.playerInfo?.team?.id;
  const userId = userInfo?.playerInfo?.id;

  const isAbandoned = true;
  
  const isOnThisTeam = isAuthenticated && Number(userTeamId) === Number(id);

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
    } catch (error) {
      const errorData = error as { data?: { errorMessage?: string } };
      setApplyError(
        errorData?.data?.errorMessage ||
          "An unexpected error occurred. Please try again later.",
      );
      setShowApplyErrorModal(true);
    }
  }, [id, applyToTeamMutation]);

  const quitTeam = useCallback(async () => {
    if (!userTeamId) return;
    try {
      await quitTeamMutation({ teamId: userTeamId }).unwrap();
      if (isCaptain && tokens?.refreshToken) {
        try {
          await refreshTokens(tokens.refreshToken);
        } catch {}
      }
      setShowQuitSuccessModal(true);
      refetchUserInfo();
    } catch (error) {
      const errorData = error as { data?: { errorMessage?: string } };
      setQuitTeamError(
        errorData?.data?.errorMessage ||
          "An unexpected error occurred. Please try again later.",
      );
      setShowQuitErrorModal(true);
    }
  }, [
    userTeamId,
    isCaptain,
    quitTeamMutation,
    tokens?.refreshToken,
    refetchUserInfo,
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
              alt={teamInfo?.team.name ?? "Team"}
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
                <div className={styles.errorText}>Failed to load team info</div>
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
              {!isMobile && isCaptain && (
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
              {showApplyButton && (
                <Button
                  handleClick={handleApplyClick}
                  content="Apply"
                  className="red_button_transparant_white_text"
                />
              )}
              {isAbandoned &&
                <div className={styles.abandoned}>
                  <Image src={infoIcon} alt=""/>
                  <div className={styles.abandonedText}>Abandoned</div>
                </div>
              }
              {isOnThisTeam && (
                <Button
                  handleClick={() => setShowQuitConfirmModal(true)}
                  content="Quit"
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
            </div>
          </div>
        </div>

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
                <div className={styles.playerName}>{captainFullName}
                {!isCaptain &&
                  <div className={styles.captainLabel}> (C) </div>}
                </div>
              </Link>
              <div className={styles.buttonsWrapper}>
                {captainAge !== null && (
                  <div className={styles.button}>
                    <span>Age: </span>
                    {captainAge}
                  </div>
                )}
                {teamInfo.captain.workingFoot && (
                  <div className={styles.button}>
                    <span>Foot: </span>
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
          Overview
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
          href={`${base}/transfers`}
          className={`${styles.link} ${isActive(`${base}/transfers`) ? styles.selected : ""}`}
        >
          Transfers
        </Link>
        <Link
          href={`${base}/squad`}
          className={`${styles.link} ${isActive(`${base}/squad`) ? styles.selected : ""}`}
        >
          Squad
        </Link>
      </div>

      {/* Apply modals */}
      {showApplyConfirmModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowApplyConfirmModal(false)}
          title="Team Application"
          description={`Apply to ${teamInfo?.team.name ?? "this team"}? Your phone number will be visible to the captain for contact.`}
          confirmButtonText="Confirm"
          onConfirmButtonClick={() => {
            setShowApplyConfirmModal(false);
            applyToTeam();
          }}
          cancelButtonText="Cancel"
        />
      )}
      {showApplySuccessModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowApplySuccessModal(false)}
          title="Application Sent Successfully"
          description="Your application was sent successfully to the team."
          cancelButtonText="Close"
        />
      )}
      {showApplyErrorModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowApplyErrorModal(false)}
          title="Cannot Apply"
          description={applyError || "An error occurred."}
          confirmButtonText="OK"
        />
      )}
      {showCaptainWarningModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowCaptainWarningModal(false)}
          title="Action Not Allowed"
          description="You are the captain of the team. Pass the captain role to another player or Quit the team if you want to apply to another team."
          cancelButtonText="Close"
        />
      )}

      {/* Quit modals */}
      {showQuitConfirmModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowQuitConfirmModal(false)}
          title="Quit Team"
          description="Are you sure you want to quit the team?"
          confirmButtonText="Confirm"
          onConfirmButtonClick={() => {
            setShowQuitConfirmModal(false);
            quitTeam();
          }}
          cancelButtonText="Cancel"
        />
      )}
      {showQuitSuccessModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowQuitSuccessModal(false)}
          title="Successfully Quit Team"
          description={
            isCaptain
              ? "You have left the team. The team is now abandoned."
              : "You have left the team."
          }
          cancelButtonText="Close"
        />
      )}
      {showQuitErrorModal && (
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowQuitErrorModal(false)}
          title="Cannot Quit Team"
          description={quitTeamError || "An error occurred."}
          confirmButtonText="OK"
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
