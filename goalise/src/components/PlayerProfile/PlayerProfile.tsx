"use client";
import PlayerProfileCard from "@/entities/PlayerProfileCard";
import toBeDeleted from "../../assets/pngs/toBeDeleted.png";
import TransferHistoryCard from "@/entities/TransferHistoryCard";
import styles from "./PlayerProfile.module.css";
import MatchList from "@/entities/MatchList";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { useState } from "react";
import { useGetPlayerBasicInfoQuery } from "@/app/store/services/api";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

const hello = () => {
  console.log("hello");
};
// const TransferObj: ITransferItemCardProps[] = [
//   {
//     date: "25.06.25",
//     fromTeamLogo: tranferHistoryIcon,
//     fromTeamName: "Team Name",
//     toTeamLogo: tranferHistoryIcon,
//     toTeamName: "Team Name",
//   },
//   {
//     date: "25.06.25",
//     fromTeamLogo: tranferHistoryIcon,
//     fromTeamName: "Team Name",
//     toTeamLogo: tranferHistoryIcon,
//     toTeamName: "Team Name",
//   },
//   {
//     date: "25.06.25",
//     fromTeamLogo: tranferHistoryIcon,
//     fromTeamName: "Team Name",
//     toTeamLogo: tranferHistoryIcon,
//     toTeamName: "Team Name",
//   },
// ];

// const MatchObject: IMatchCardProps[] = [
//   {
//     fisrtTeamName: "Team Name",
//     firstTeamNameValue: 5,
//     secondTeamName: "Team Name",
//     secondTeamNameValue: 6,
//     date: "25.06.25",
//     goalsCount: 5,
//     peopleCount: 2,
//     redCardsCount: 2,
//     yellowCardsCount: 2,
//   },
//   {
//     fisrtTeamName: "Team Name",
//     firstTeamNameValue: 5,
//     secondTeamName: "Team Name",
//     secondTeamNameValue: 6,
//     date: "25.06.25",
//     goalsCount: 5,
//     peopleCount: 2,
//     redCardsCount: 2,
//     yellowCardsCount: 2,
//   },
//   {
//     fisrtTeamName: "Team Name",
//     firstTeamNameValue: 5,
//     secondTeamName: "Team Name",
//     secondTeamNameValue: 6,
//     date: "25.06.25",
//     goalsCount: 5,
//     peopleCount: 2,
//     redCardsCount: 2,
//     yellowCardsCount: 2,
//   },
// ];
export const PlayerProfile = () => {
  const [showInvitation, setShowInvitation] = useState(true);
  const { playerId } = useParams();
  const { data: playerBasicInfo } = useGetPlayerBasicInfoQuery(
    Number(playerId)
  );
  const t = useTranslations("common.playerProfile.playerBasicInfo");

  const onButtonClick = () => {
    setShowInvitation(!showInvitation);
  };

  return (
    <div className={styles.container}>
      <div className={styles.playerProfileCard}>
        <PlayerProfileCard
          phoneNumber={playerBasicInfo?.playerInfo.userInfo.phoneNumber || ""}
          onInviteButtonClick={onButtonClick}
          playerNumber={String(playerBasicInfo?.playerInfo.shirtNumber || "")}
          inviteButtonText={t("inviteButtonText")}
          makeCaptainButtonText={t("makeCaptainButtonText")}
          onMakeCaptainButtonClick={hello}
          onRemoveUserButtonClick={hello}
          profilePic={toBeDeleted}
          fullName={`${playerBasicInfo?.playerInfo.userInfo.firstName} ${playerBasicInfo?.playerInfo.userInfo.lastName}`}
          age={String(playerBasicInfo?.playerInfo.userInfo.age || "")}
          foot={playerBasicInfo?.playerInfo.userInfo.workingFoot || ""}
          onQuitTeamButtonClick={hello}
          quitTeamButtonText={t("quitTeamButtonText")}
          teamName={playerBasicInfo?.playerInfo.team.name || ""}
          isCaptain={true}
          teamLogo={toBeDeleted}
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
          onCancelButtonClick={onButtonClick}
          onConfirmButtonClick={hello}
        />
      )}
    </div>
  );
};
