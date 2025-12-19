"use client";
import PlayerProfileCard from "@/entities/PlayerProfileCard";
import toBeDeleted from "../../assets/pngs/toBeDeleted.png";
import TransferHistoryCard from "@/entities/TransferHistoryCard";
import styles from "./PlayerProfile.module.css";
import MatchList from "@/entities/MatchList";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { useState } from "react";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePlayerProfile } from "./usePlayerProfile";
import PopupModal from "@/entities/PopupModal";

// placeholder removed; real handlers supplied from hook
export const PlayerProfile = () => {
  const [showInvitation, setShowInvitation] = useState(true);
  const { playerId } = useParams();
  const router = useRouter();

  const t = useTranslations("common.playerProfile.playerBasicInfo");
  const {
    userInfo,
    playerBasicInfo,
    sendTeamInvitation,
    removeTeamMember,
    makeTeamCaptain,
    quitTeam,
    showInvitationErrorModal,
    closeInvitationErrorModal,
    invitationError,
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
  } = usePlayerProfile(Number(playerId));

  const onShowInvitationModal = () => {
    setShowInvitation(!showInvitation);
  };

  // Compute role: Captain = true if user is captain, false if user exists but not captain, undefined if no user
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

  // Wrapped invite handler that checks role and handles guest redirect
  const handleInviteClick = () => {
    // Guest: redirect to login
    if (!isLoggedIn) {
      router.push("/signin-oidc");
      return;
    }

    // Non-captain logged-in user: show "not allowed" modal
    if (isLoggedIn && !isUserCaptain) {
      setShowNotCaptainModal(true);
      return;
    }

    // Captain or no role restriction: show invitation modal
    onShowInvitationModal();
  };

  return (
    <div className={styles.container}>
      <div className={styles.playerProfileCard}>
        <PlayerProfileCard
          phoneNumber={playerBasicInfo?.playerInfo.userInfo.phoneNumber || ""}
          onInviteButtonClick={handleInviteClick}
          playerNumber={String(playerBasicInfo?.playerInfo.shirtNumber || "")}
          inviteButtonText={t("inviteButtonText")}
          makeCaptainButtonText={t("makeCaptainButtonText")}
          onMakeCaptainButtonClick={makeTeamCaptain}
          onRemoveUserButtonClick={removeTeamMember}
          profilePic={toBeDeleted}
          fullName={`${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName}`}
          age={String(playerBasicInfo?.playerInfo.userInfo.age || "")}
          foot={playerBasicInfo?.playerInfo.userInfo.workingFoot || ""}
          onQuitTeamButtonClick={quitTeam}
          quitTeamButtonText={t("quitTeamButtonText")}
          teamName={playerBasicInfo?.playerInfo.team?.name || ""}
          isCaptain={isUserCaptain}
          isSameTeam={isSameTeam}
          isViewingSelf={isViewingSelf}
          teamLogo={toBeDeleted}
          isLoggedIn={isLoggedIn}
          playerHasTeam={Boolean(playerBasicInfo?.playerInfo.team)}
        />
      </div>
      <div className={styles.grid}>
        <div className={styles.transferHistoryCard}>
          <TransferHistoryCard />
        </div>
        <div className={styles.matchCard}>
          <MatchList  />
        </div>
      </div>
      {!showInvitation && (
        <PlayerInvitationCard
          onCancelButtonClick={onShowInvitationModal}
          onConfirmButtonClick={() => {
            sendTeamInvitation();
            onShowInvitationModal();
          }}
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
    </div>
  );
};
