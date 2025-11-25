"use client"
import PlayerProfileCard from "@/entities/PlayerProfileCard";
import toBeDeleted from '../../../assets/pngs/toBeDeleted.png'
import TransferHistoryCard from "@/entities/TransferHistoryCard";
import tranferHistoryIcon from '../../../assets/pngs/transferHistoryIcon.png';
import styles from './styles.module.css';
import MatchList from "@/entities/MatchList";
import { ITransferItemCardProps } from "@/entities/TransferItemCard/TransferItemCard.types";
import { IMatchCardProps } from "@/entities/MatchCard/MatchCard.types";
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { useState } from "react";

const hello = () => {
  console.log("hello");
}
const TransferObj: ITransferItemCardProps[] = [
  {
    date: '25.06.25',
    fromTeamLogo: tranferHistoryIcon,
    fromTeamName: 'Team Name',
    toTeamLogo: tranferHistoryIcon,
    toTeamName: 'Team Name'
  },
  {
    date: '25.06.25',
    fromTeamLogo: tranferHistoryIcon,
    fromTeamName: 'Team Name',
    toTeamLogo: tranferHistoryIcon,
    toTeamName: 'Team Name'
  },
  {
    date: '25.06.25',
    fromTeamLogo: tranferHistoryIcon,
    fromTeamName: 'Team Name',
    toTeamLogo: tranferHistoryIcon,
    toTeamName: 'Team Name'
  },
];

const MatchObject: IMatchCardProps[] = [
  {
    fisrtTeamName: 'Team Name',
    firstTeamNameValue: 5,
    secondTeamName: 'Team Name',
    secondTeamNameValue: 6,
    date: '25.06.25',
    goalsCount: 5,
    peopleCount: 2,
    redCardsCount: 2,
    yellowCardsCount: 2
  },
  {
    fisrtTeamName: 'Team Name',
    firstTeamNameValue: 5,
    secondTeamName: 'Team Name',
    secondTeamNameValue: 6,
    date: '25.06.25',
    goalsCount: 5,
    peopleCount: 2,
    redCardsCount: 2,
    yellowCardsCount: 2
  },
  {
    fisrtTeamName: 'Team Name',
    firstTeamNameValue: 5,
    secondTeamName: 'Team Name',
    secondTeamNameValue: 6,
    date: '25.06.25',
    goalsCount: 5,
    peopleCount: 2,
    redCardsCount: 2,
    yellowCardsCount: 2
  }
]
export default function PlayerProfilePage() {
  const [showInvitation, setShowInvitation] = useState(true);

  const onButtonClick = () => {
    setShowInvitation(!showInvitation);
  };

  return (
    <div className={styles.container}> 
      <div className={styles.playerProfileCard}> 
        <PlayerProfileCard 
              phoneNumber=" (406) 555-0120" 
              onInviteButtonClick={onButtonClick} 
              playerNumber={'11'} 
              inviteButtonText="Invite"
              makeCaptainButtonText="Make Captain"
              onMakeCaptainButtonClick={hello}
              onRemoveUserButtonClick={hello}
              profilePic={toBeDeleted}
              fullName="Poghos Petrosyan"
              age="27"
              foot="Right"
              onQuitTeamButtonClick={hello}
              quitTeamButtonText="Quit Team"
              teamName="Team Name"
              isCaptain = {true}
              teamLogo={toBeDeleted}
          />
      </div>
      <div className={styles.grid}> 
          <div className={styles.transferHistoryCard}> 
              <TransferHistoryCard object={TransferObj}/>
          </div>
          <div className={styles.matchCard}> 
            <MatchList object={MatchObject}/>
          </div>
        </div>
        {!showInvitation && (
        <PlayerInvitationCard onCancelButtonClick={onButtonClick} onConfirmButtonClick={hello} />
      )}
    </div>
  );
}
