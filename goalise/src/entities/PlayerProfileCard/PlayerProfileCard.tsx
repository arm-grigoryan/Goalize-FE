"use client"
import styles from './PlayerProfileCard.module.css';
import { IPlayerProfileProps } from '@/entities/PlayerProfileCard/PlayerProfileCard.types';
import Button from '@/shared/Button';
import plusButtonImg from '../../assets/pngs/plusButton.png';
import removeUserIng from '../../assets/pngs/removeUser.png';
import Image  from 'next/image';
import PlayerStatistics from '../PlayerStatistics/PlayerStatistics';
import Scroll from '@/shared/Scroll/Scroll';
import UnassignedPlayerCard from '../UnassignedPlayerCard/UnassignedPlayerCard';
import en from '../../../messages/en.json';

 const PlayerProfileCard: React.FC<IPlayerProfileProps> = ({
  profilePic,
  phoneNumber,
  playerNumber,
  inviteButtonText,
  fullName,
  age,
  foot,
  makeCaptainButtonText,
  isCaptain,
  onInviteButtonClick,
  onMakeCaptainButtonClick,
  onRemoveUserButtonClick,
  teamLogo,
  teamName,
  quitTeamButtonText,
  onQuitTeamButtonClick,
}) => {
  return (
    <div className={styles.container}>
    <div className={styles.leftContainer}>
      <div className={styles.playerContainer}>
        <div className={styles.imageWrapper}>
          {profilePic && <Image src={profilePic} className={styles.image} alt={''} />}
        </div>
        <div className={styles.infoButtonPart}>
          <div className={styles.imageInfoContainer}>
            <div className={styles.playerInfoContainer}>
              { isCaptain && onInviteButtonClick && inviteButtonText && 
              <Button
                className="blue_button_transparant"
                content={inviteButtonText}
                handleClick={onInviteButtonClick}
                icon={plusButtonImg}
              />}
              <div className={styles.name}>{fullName}</div>
              <div className={styles.infoButtons}>
                <div className={styles.button}>{en.playerProfile.buttons.age}: <span> {age} </span></div>
                <div className={styles.button}>{en.playerProfile.buttons.foot}: <span> {foot} </span> </div>
                <div className={styles.button}>{en.playerProfile.buttons.contact}: <span> {phoneNumber} </span></div>
              </div>
            </div>
          </div>
          <div className={styles.buttonsContainer}>
            { isCaptain && onMakeCaptainButtonClick && makeCaptainButtonText &&
             <Button
              className="red_button_transparant_white_text"
              handleClick={onMakeCaptainButtonClick}
              content={makeCaptainButtonText}
            /> }
           { teamName &&  onRemoveUserButtonClick && 
            <Button
              className="icon_button"
              icon={removeUserIng}
              iconHeight={12}
              iconWidth={12}
              handleClick={onRemoveUserButtonClick}
            />
             }
          </div>
          {!teamName && 
               <div className={styles.unassignedContainer}> 
                  <UnassignedPlayerCard link='/'/>
                 </div>
           }
        </div>
        { teamName &&  
        <div className={styles.playerNumberContainer}> 
          {playerNumber && (
              <div className={styles.playerNumber}>{playerNumber}</div>
          )}
          </div>
          }
      </div>
     { teamName && 
     <div className={styles.teamContainer}>
        <div className={styles.team}>  
          <div className={styles.teamInfo}>
           {teamLogo && <Image className={styles.teamImg} alt='' src={teamLogo}/> }
            <div className={styles.teamName}>{teamName}</div>
          </div>
        {onQuitTeamButtonClick && quitTeamButtonText &&  <Button
            className="red_button_transparant_white_text"
            handleClick={onQuitTeamButtonClick}
            content={quitTeamButtonText}
          />
        }
          </div> 
        </div>
      }
    </div>
    <div className={styles.rightContainer}> 
      <Scroll maxHeight='100%'>
        <PlayerStatistics
          gamesPlayed={1134}
          goals={0}
          assists={0}
          averageRate={0}
          shotsCompleted={0}
          shotAccuracyPercent={30}
        />
      </Scroll>
      </div>
    </div>
  );
};
PlayerProfileCard.displayName = 'PlayerProfileCard';
export default PlayerProfileCard;
