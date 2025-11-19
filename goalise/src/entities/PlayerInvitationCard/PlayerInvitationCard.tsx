import Button from '@/shared/Button';
import styles from './PlayerInvitationCard.module.css';
import en from '../../../messages/en.json';

interface IPlayerInvitationCardProps {
    onConfirmButtonClick?: () => void;
    onCancelButtonClick?: () => void;
}
const PlayerInvitationCard: React.FC <IPlayerInvitationCardProps> = ({
    onConfirmButtonClick,
    onCancelButtonClick
}) => {
    return (
  <div className={styles.cardOverlay}>
    <div className={styles.cardContainer}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          {en.playerProfile.playerInvitationCard.title}
        </div>
        <div className={styles.label}>
          {en.playerProfile.playerInvitationCard.label}
        </div>
      </div>

      <div className={styles.buttonsWrapper}>
        {onConfirmButtonClick && (
          <Button
            className="red_button"
            content={en.playerProfile.playerInvitationCard.confirmButtonText}
            handleClick={onConfirmButtonClick}
          />
        )}
        {onCancelButtonClick && (
         <Button
            className="red_button_transparant_white_text"
            content={en.playerProfile.playerInvitationCard.cancelButtonText}
            handleClick={onCancelButtonClick}
          />
        )}
      </div>
    </div>
  </div>
);
}
PlayerInvitationCard.displayName = "PlayerInvitationCard";
export default PlayerInvitationCard;