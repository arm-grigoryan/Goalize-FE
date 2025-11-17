"use client"
import PlayerProfileCard from "@/entities/PlayerProfileCard/PlayerProfileCard";
import toBeDeleted from '../../../assets/pngs/toBeDeleted.png'
import TransferHistoryCard from "@/entities/TransferHistoryCard/TransferHistoryCard";
import tranferHistoryIcon from '../../../assets/pngs/transferHistoryIcon.png';
import styles from './styles.module.css';
import MatchList from "@/entities/MatchList/MatchList";
import { ITransferItemCardProps } from "@/entities/TransferItemCard/TransferItemCard.types";
import { IMatchCardProps } from "@/entities/MatchCard/MatchCard.types";

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
  return (
    <div> 
      <div className={styles.playerProfileCard}> 
    <PlayerProfileCard 
          phoneNumber=" (406) 555-0120" 
          onInviteButtonClick={hello} 
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
      />
      </div>
      <div className={styles.grid}> 
      <div className={styles.transferHistoryCard}> 
        <TransferHistoryCard 
                icon={tranferHistoryIcon}  
                title="Transfer History" 
                context="Players who transfer from 1 team to another will display here"
                object={TransferObj}
            />
        </div>
        <div className={styles.matchCard}> 
          <MatchList  
              title="Match List"
              object={MatchObject}
          />
        </div>
        </div>
    </div>
  );
}
