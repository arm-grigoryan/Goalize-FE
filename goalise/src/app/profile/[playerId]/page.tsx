"use client"
import PlayerProfileCard from "@/entities/PlayerProfileCard/PlayerProfileCard";
import toBeDeleted from '../../../assets/pngs/toBeDeleted.png'
import TransferHistoryCard from "@/entities/TransferHistoryCard/TransferHistoryCard";
import tranferHistoryIcon from '../../../assets/pngs/transferHistoryIcon.png';
import styles from './styles.module.css';
import MatchList from "@/entities/MatchList/MatchList";

const hello = () => {
  console.log("hello");
}
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
            />
        </div>
        <div> 
          <MatchList />
        </div>
        </div>
    </div>
  );
}
