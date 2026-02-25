import Button from '@/shared/Button';
import styles from './PlayerInvitationCard.module.css';
import { useTranslations } from 'next-intl';

interface IPlayerInvitationCardProps {
  onConfirmButtonClick?: () => void;
  onCancelButtonClick?: () => void;
  playerName?: string;
  title?: string;
  description?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}
export const PlayerInvitationCard: React.FC<IPlayerInvitationCardProps> = ({
  onConfirmButtonClick,
  onCancelButtonClick,
  playerName,
  title,
  description,
  confirmButtonText,
  cancelButtonText
}) => {
  const t = useTranslations("playerProfile.playerInvitationCard");

  return (
    <div className={styles.cardOverlay}>
      <div className={styles.cardContainer}>
        <div className={styles.titleWrapper}>
          {title !== "" && (
            <div className={styles.title}>
              {title ? title : t("title")}
            </div>
          )}
          <div className={styles.label}>
            {description ? description : playerName ? t('label', { playerName }) : t('label')}
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          {onConfirmButtonClick && (
            <Button
              className="red_button"
              content={confirmButtonText ? confirmButtonText : t("confirmButtonText")}
              handleClick={onConfirmButtonClick}
            />
          )}
          {onCancelButtonClick && (
            <Button
              className="red_button_transparant_white_text"
              content={cancelButtonText ? cancelButtonText : t("cancelButtonText")}
              handleClick={onCancelButtonClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};