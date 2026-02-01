"use client";
import PlayerProfileCard from "@/entities/PlayerProfileCard";
import toBeDeleted from "../../assets/pngs/toBeDeleted.png";
import TransferHistoryCard from "@/entities/TransferHistoryCard";
import styles from "./PlayerProfile.module.css";
import MatchList from "@/entities/MatchList";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { useState } from "react";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePlayerProfile } from "./usePlayerProfile";
import PopupModal from "@/entities/PopupModal";
import { useAuth } from "@/shared/auth/AuthContext";
import {refreshTokens} from "@/shared/auth/oidcService"

export const PlayerProfile = () => {
  const [showInvitation, setShowInvitation] = useState(true);
  const { playerId } = useParams();
  const { signIn, tokens } = useAuth();
  

  const t = useTranslations("common.playerProfile.playerBasicInfo");
  const {
    userInfo,
    playerBasicInfo,
    isLoadingPlayerInfo,
    sendTeamInvitation,
    isSendingInvitation,
    removeTeamMember,
    makeTeamCaptain,
    quitTeam,
    showInvitationErrorModal,
    closeInvitationErrorModal,
    invitationError,
    showInvitationSuccessModal,
    closeInvitationSuccessModal,
    removeMemberError,
    showRemoveMemberErrorModal,
    closeRemoveMemberErrorModal,
    makeCaptainError,
    showMakeCaptainErrorModal,
    closeMakeCaptainErrorModal,
    quitTeamError,
    showQuitTeamErrorModal,
    closeQuitTeamErrorModal,
    showNotCaptainModal,
    setShowNotCaptainModal,
    showMakeCaptainConfirmModal,
    setShowMakeCaptainConfirmModal,
    showRemoveMemberConfirmModal,
    setShowRemoveMemberConfirmModal,
    showQuitTeamConfirmModal,
    setShowQuitTeamConfirmModal,
    showMakeCaptainSuccessModal,
    closeMakeCaptainSuccessModal,
    showRemoveMemberSuccessModal,
    closeRemoveMemberSuccessModal,
    showQuitTeamSuccessModal,
    closeQuitTeamSuccessModal,
    isRemovingMember,
    isMakingCaptain,
    isQuitting,
  } = usePlayerProfile({
    playerId: Number(playerId),
    refreshTokens,
    tokens,
  });

  const onShowInvitationModal = () => {
    setShowInvitation(!showInvitation);
  };

  const isUserCaptain = userInfo
    ? userInfo?.playerInfo.id === userInfo?.playerInfo.team?.captainId
      ? true
      : false
    : undefined;
  const isLoggedIn = Boolean(userInfo);

  const viewerTeamId = userInfo?.playerInfo.team?.id;
  const viewedTeamId = playerBasicInfo?.playerInfo.team?.id;
  const isSameTeam =
    typeof viewerTeamId !== "undefined" &&
    typeof viewedTeamId !== "undefined" &&
    viewerTeamId === viewedTeamId;
  const isViewingSelf =
    userInfo?.playerInfo.id === playerBasicInfo?.playerInfo.id;

  const handleInviteClick = () => {
    if (!isLoggedIn) {
      signIn();
      return;
    }

    if (isLoggedIn && !isUserCaptain) {
      setShowNotCaptainModal(true);
      return;
    }
    onShowInvitationModal();
  };

  const handleMakeCaptainClick = () => {
    setShowMakeCaptainConfirmModal(true);
  };

  const handleRemoveMemberClick = () => {
    setShowRemoveMemberConfirmModal(true);
  };

  const handleQuitTeamClick = () => {
    setShowQuitTeamConfirmModal(true);
  };

  const handleConfirmMakeCaptain = () => {
    setShowMakeCaptainConfirmModal(false);
    makeTeamCaptain();
  };

  const handleConfirmRemoveMember = () => {
    setShowRemoveMemberConfirmModal(false);
    removeTeamMember();
  };

  const handleConfirmQuitTeam = () => {
    setShowQuitTeamConfirmModal(false);
    quitTeam();
  };

  return (
    <div className={styles.container}>
      <div className={styles.playerProfileCard}>
        <div style={isLoadingPlayerInfo ? { visibility: "hidden" } : {}}>
          <PlayerProfileCard
            phoneNumber={playerBasicInfo?.playerInfo.userInfo.phoneNumber || ""}
            onInviteButtonClick={handleInviteClick}
            playerNumber={String(playerBasicInfo?.playerInfo.shirtNumber || "")}
            inviteButtonText={t("inviteButtonText")}
            makeCaptainButtonText={t("makeCaptainButtonText")}
            onMakeCaptainButtonClick={handleMakeCaptainClick}
            onRemoveUserButtonClick={handleRemoveMemberClick}
            profilePic={toBeDeleted}
            fullName={`${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName}`}
            age={String(playerBasicInfo?.playerInfo.userInfo.age || "")}
            foot={playerBasicInfo?.playerInfo.userInfo.workingFoot || ""}
            onQuitTeamButtonClick={handleQuitTeamClick}
            quitTeamButtonText={t("quitTeamButtonText")}
            teamName={playerBasicInfo?.playerInfo.team?.name || ""}
            isCaptain={isUserCaptain}
            isSameTeam={isSameTeam}
            isViewingSelf={isViewingSelf}
            teamLogo={
              playerBasicInfo?.playerInfo.team ? toBeDeleted : undefined
            }
            isLoggedIn={isLoggedIn}
            playerHasTeam={Boolean(playerBasicInfo?.playerInfo.team)}
          />
        </div>
        {isLoadingPlayerInfo && (
          <div className={styles.section_loader_overlay}>
            <div className={styles.loader}></div>
          </div>
        )}
      </div>
      <div className={styles.grid}>
        <div className={styles.transferHistoryCard}>
          <TransferHistoryCard />
        </div>
        <div className={styles.matchCard}>
          <MatchList />
        </div>
      </div>
      {!showInvitation && (
        <PlayerInvitationCard
          onCancelButtonClick={onShowInvitationModal}
          onConfirmButtonClick={() => {
            onShowInvitationModal();
            sendTeamInvitation();
          }}
          playerName={`${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName}`}
        />
      )}
      <PopupModal
        open={showInvitationErrorModal}
        onClose={() => closeInvitationErrorModal()}
        title="Cannot Send Invitation"
        description={invitationError || "An error occurred."}
        buttonContent="OK"
      />
      <PopupModal
        open={showRemoveMemberErrorModal}
        onClose={() => closeRemoveMemberErrorModal()}
        title="Cannot Remove Player"
        description={removeMemberError || "An error occurred."}
        buttonContent="OK"
      />
      <PopupModal
        open={showMakeCaptainErrorModal}
        onClose={() => closeMakeCaptainErrorModal()}
        title="Cannot Make Captain"
        description={makeCaptainError || "An error occurred."}
        buttonContent="OK"
      />
      <PopupModal
        open={showQuitTeamErrorModal}
        onClose={() => closeQuitTeamErrorModal()}
        title="Cannot Quit Team"
        description={quitTeamError || "An error occurred."}
        buttonContent="OK"
      />
      <PopupModal
        open={showNotCaptainModal}
        onClose={() => setShowNotCaptainModal(false)}
        title="Action Not Allowed"
        description="You must be a captain to send invitations."
        buttonContent="OK"
      />
      <PopupModal
        open={showInvitationSuccessModal}
        onClose={() => closeInvitationSuccessModal()}
        title="Invitation Sent Successfully"
        description="The player has been invited to your team."
        buttonContent="OK"
      />
      <PopupModal
        open={showMakeCaptainConfirmModal}
        onClose={() => setShowMakeCaptainConfirmModal(false)}
        title="Make Team Captain"
        description={`Are you sure you want to make ${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName} the team captain? You will lose your captain privileges.`}
        buttonContent="Confirm"
        onButtonClick={handleConfirmMakeCaptain}
        showCancelButton
        cancelButtonContent="Cancel"
      />
      <PopupModal
        open={showMakeCaptainSuccessModal}
        onClose={() => closeMakeCaptainSuccessModal()}
        title="Captain Changed Successfully"
        description="The team captain has been updated."
        buttonContent="OK"
      />
      <PopupModal
        open={showRemoveMemberConfirmModal}
        onClose={() => setShowRemoveMemberConfirmModal(false)}
        title="Remove Team Member"
        description={`Are you sure you want to remove ${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName} from the team?`}
        buttonContent="Confirm"
        onButtonClick={handleConfirmRemoveMember}
        showCancelButton
        cancelButtonContent="Cancel"
      />
      <PopupModal
        open={showRemoveMemberSuccessModal}
        onClose={() => closeRemoveMemberSuccessModal()}
        title="Member Removed Successfully"
        description="The team member has been removed."
        buttonContent="OK"
      />
      <PopupModal
        open={showQuitTeamConfirmModal}
        onClose={() => setShowQuitTeamConfirmModal(false)}
        title="Quit Team"
        description="Are you sure you want to quit the team?"
        buttonContent="Confirm"
        onButtonClick={handleConfirmQuitTeam}
        showCancelButton
        cancelButtonContent="Cancel"
      />
      <PopupModal
        open={showQuitTeamSuccessModal}
        onClose={() => closeQuitTeamSuccessModal()}
        title="Successfully Quit Team"
        description="You have left the team."
        buttonContent="OK"
      />
      {isSendingInvitation && (
        <div className={styles.loader_container}>
          <div className={styles.loader}></div>
        </div>
      )}
      {isRemovingMember && (
        <div className={styles.loader_container}>
          <div className={styles.loader}></div>
        </div>
      )}
      {isMakingCaptain && (
        <div className={styles.loader_container}>
          <div className={styles.loader}></div>
        </div>
      )}
      {isQuitting && (
        <div className={styles.loader_container}>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  );
};
