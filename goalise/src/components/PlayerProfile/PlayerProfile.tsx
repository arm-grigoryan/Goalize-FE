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
import { useAuth } from "@/shared/auth/AuthContext";
import { refreshTokens } from "@/shared/auth/oidcService";
import { useHandle404 } from "@/hooks/useErrorHandling";
import { useEffect } from "react";

export const PlayerProfile = () => {
  const [showInvitation, setShowInvitation] = useState(true);
  const { playerId } = useParams();
  const { signIn, tokens } = useAuth();
  const handle404 = useHandle404();

  const t = useTranslations("common.playerProfile.playerBasicInfo");
  const {
    userInfo,
    playerBasicInfo,
    isLoadingPlayerInfo,
    playerInfoError,
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

  useEffect(() => {
    if (playerInfoError) {
      handle404(playerInfoError);
    }
  }, [playerInfoError, handle404]);

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
      {showInvitationErrorModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeInvitationErrorModal()}
          title="Cannot Send Invitation"
          description={invitationError || "An error occurred."}
          confirmButtonText="OK"
        />}
      {showRemoveMemberErrorModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeRemoveMemberErrorModal()}
          title="Cannot Remove Player"
          description={removeMemberError || "An error occurred."}
          confirmButtonText="OK"
        />}
      {showMakeCaptainErrorModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeMakeCaptainErrorModal()}
          title="Cannot Make Captain"
          description={makeCaptainError || "An error occurred."}
          confirmButtonText="OK"
        />}
      {showQuitTeamErrorModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeQuitTeamErrorModal()}
          title="Cannot Quit Team"
          description={quitTeamError || "An error occurred."}
          confirmButtonText="OK"
        />}
      {showNotCaptainModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowNotCaptainModal(false)}
          title="Action Not Allowed"
          description="You must be a captain to send invitations."
          confirmButtonText="OK"
        />
      }
      {showInvitationSuccessModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeInvitationSuccessModal()}
          title="Invitation Sent Successfully"
          description="The player has been invited to your team."
          confirmButtonText="OK"
        />}
      {showMakeCaptainConfirmModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowMakeCaptainConfirmModal(false)}
          title="Make Team Captain"
          description={`Are you sure you want to make ${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName} the team captain? You will lose your captain privileges.`}
          confirmButtonText="Confirm"
          onConfirmButtonClick={handleConfirmMakeCaptain}
          cancelButtonText="Cancel"
        />}
      {showMakeCaptainSuccessModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeMakeCaptainSuccessModal()}
          title="Captain Changed Successfully"
          description="The team captain has been updated."
          confirmButtonText="OK"
        />}
      {showRemoveMemberConfirmModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowRemoveMemberConfirmModal(false)}
          title="Remove Team Member"
          description={`Are you sure you want to remove ${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName} from the team?`}
          confirmButtonText="Confirm"
          onConfirmButtonClick={handleConfirmRemoveMember}
          cancelButtonText="Cancel"
        />}
      {showRemoveMemberSuccessModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeRemoveMemberSuccessModal()}
          title="Member Removed Successfully"
          description="The team member has been removed."
          confirmButtonText="OK"
        />}
      {showQuitTeamConfirmModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowQuitTeamConfirmModal(false)}
          title="Quit Team"
          description="Are you sure you want to quit the team?"
          confirmButtonText="Confirm"
          onConfirmButtonClick={handleConfirmQuitTeam}
          cancelButtonText="Cancel"
        />}
      {showQuitTeamSuccessModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeQuitTeamSuccessModal()}
          title="Successfully Quit Team"
          description="You have left the team."
          confirmButtonText="OK"
        />}
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
