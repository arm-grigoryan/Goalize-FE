"use client";
import PlayerProfileCard from "@/entities/PlayerProfileCard";
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
  const tModals = useTranslations("playerProfile.modals");
  const tCommon = useTranslations("common");
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
            profilePic={playerBasicInfo?.playerInfo.userInfo.profilePic}
            fullName={`${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName}`}
            age={String(playerBasicInfo?.playerInfo.userInfo.age || "")}
            foot={playerBasicInfo?.playerInfo.userInfo.workingFoot || ""}
            onQuitTeamButtonClick={handleQuitTeamClick}
            quitTeamButtonText={t("quitTeamButtonText")}
            teamName={playerBasicInfo?.playerInfo.team?.name || ""}
            isCaptain={isUserCaptain}
            isSameTeam={isSameTeam}
            isViewingSelf={isViewingSelf}
            teamLogo={playerBasicInfo?.playerInfo.team?.logoUrl}
            teamId={playerBasicInfo?.playerInfo.team?.id}
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
          title={tModals("cannotSendInvitation")}
          description={invitationError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
        />}
      {showRemoveMemberErrorModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeRemoveMemberErrorModal()}
          title={tModals("cannotRemovePlayer")}
          description={removeMemberError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
        />}
      {showMakeCaptainErrorModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeMakeCaptainErrorModal()}
          title={tModals("cannotMakeCaptain")}
          description={makeCaptainError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
        />}
      {showQuitTeamErrorModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeQuitTeamErrorModal()}
          title={tModals("cannotQuitTeam")}
          description={quitTeamError || tModals("errorOccurred")}
          confirmButtonText={tCommon("ok")}
        />}
      {showNotCaptainModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowNotCaptainModal(false)}
          title={tModals("actionNotAllowed")}
          description={tModals("mustBeCaptain")}
          confirmButtonText={tCommon("ok")}
        />
      }
      {showInvitationSuccessModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeInvitationSuccessModal()}
          title={tModals("invitationSentTitle")}
          description={tModals("invitationSentDescription")}
          cancelButtonText={tCommon("close")}
        />}
      {showMakeCaptainConfirmModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowMakeCaptainConfirmModal(false)}
          title={tModals("makeCaptainTitle")}
          description={tModals("makeCaptainDescription", {
            firstName: playerBasicInfo?.playerInfo.userInfo.firstName ?? "",
            lastName: playerBasicInfo?.playerInfo.userInfo.lastName ?? "",
          })}
          confirmButtonText={tCommon("confirm")}
          onConfirmButtonClick={handleConfirmMakeCaptain}
          cancelButtonText={tCommon("cancel")}
        />}
      {showMakeCaptainSuccessModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeMakeCaptainSuccessModal()}
          title={tModals("captainChangedTitle")}
          description={tModals("captainChangedDescription")}
          cancelButtonText={tCommon("close")}
        />}
      {showRemoveMemberConfirmModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowRemoveMemberConfirmModal(false)}
          title={tModals("removeMemberTitle")}
          description={tModals("removeMemberDescription", {
            firstName: playerBasicInfo?.playerInfo.userInfo.firstName ?? "",
            lastName: playerBasicInfo?.playerInfo.userInfo.lastName ?? "",
          })}
          confirmButtonText={tCommon("confirm")}
          onConfirmButtonClick={handleConfirmRemoveMember}
          cancelButtonText={tCommon("cancel")}
        />}
      {showRemoveMemberSuccessModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeRemoveMemberSuccessModal()}
          title={tModals("memberRemovedTitle")}
          description={tModals("memberRemovedDescription")}
          cancelButtonText={tCommon("close")}
        />}
      {showQuitTeamConfirmModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => setShowQuitTeamConfirmModal(false)}
          title={tModals("quitTeamTitle")}
          description={tModals("quitTeamDescription")}
          confirmButtonText={tCommon("confirm")}
          onConfirmButtonClick={handleConfirmQuitTeam}
          cancelButtonText={tCommon("cancel")}
        />}
      {showQuitTeamSuccessModal &&
        <PlayerInvitationCard
          onCancelButtonClick={() => closeQuitTeamSuccessModal()}
          title={tModals("quitSuccessTitle")}
          description={tModals("quitSuccessDescription")}
          cancelButtonText={tCommon("close")}
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
