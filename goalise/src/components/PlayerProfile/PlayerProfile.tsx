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

const hello = () => {
  console.log("hello");
};
export const PlayerProfile = () => {
  const [showInvitation, setShowInvitation] = useState(true);
  const { playerId } = useParams();

  const t = useTranslations("common.playerProfile.playerBasicInfo");
  const {
    userInfo,
    playerBasicInfo,
    sendTeamInvitation,
    removeTeamMember,
    makeTeamCaptain,
    showInvitationErrorModal,
    closeInvitationErrorModal,
    invitationError,
  } = usePlayerProfile(Number(playerId));
  const onShowInvitationModal = () => {
    setShowInvitation(!showInvitation);
  };
  const isCaptain =
    userInfo?.playerInfo.id === userInfo?.playerInfo.team.captainId;

  return (
    <div className={styles.container}>
      <div className={styles.playerProfileCard}>
        <PlayerProfileCard
          phoneNumber={playerBasicInfo?.playerInfo.userInfo.phoneNumber || ""}
          onInviteButtonClick={onShowInvitationModal}
          playerNumber={String(playerBasicInfo?.playerInfo.shirtNumber || "")}
          inviteButtonText={t("inviteButtonText")}
          makeCaptainButtonText={t("makeCaptainButtonText")}
          onMakeCaptainButtonClick={makeTeamCaptain}
          onRemoveUserButtonClick={removeTeamMember}
          profilePic={toBeDeleted}
          fullName={`${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName}`}
          age={String(playerBasicInfo?.playerInfo.userInfo.age || "")}
          foot={playerBasicInfo?.playerInfo.userInfo.workingFoot || ""}
          onQuitTeamButtonClick={hello}
          quitTeamButtonText={t("quitTeamButtonText")}
          teamName={playerBasicInfo?.playerInfo.team?.name || ""}
          isCaptain={isCaptain}
          teamLogo={toBeDeleted}
          playerHasTeam={Boolean(playerBasicInfo?.playerInfo.team)}
        />
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
    </div>
  );
};
