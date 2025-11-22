import Button from '@/shared/Button';
import styles from './PlayerInvitationCard.module.css';
import { useTranslations } from 'next-intl';

interface IPlayerInvitationCardProps {
    onConfirmButtonClick?: () => void;
    onCancelButtonClick?: () => void;
}
export const PlayerInvitationCard: React.FC <IPlayerInvitationCardProps> = ({
    onConfirmButtonClick,
    onCancelButtonClick
}) => {
  const t = useTranslations("playerProfile.playerInvitationCard");
    return (
  <div className={styles.cardOverlay}>
    <div className={styles.cardContainer}>
      <div className={styles.titleWrapper}>
        <div className={styles.title}>
          {t("title")}
        </div>
        <div className={styles.label}>
          {t("label")}
        </div>
      </div>

      <div className={styles.buttonsWrapper}>
        {onConfirmButtonClick && (
          <Button
            className="red_button"
            content={t("confirmButtonText")}
            handleClick={onConfirmButtonClick}
          />
        )}
        {onCancelButtonClick && (
         <Button
            className="red_button_transparant_white_text"
            content={t("cancelButtonText")}
            handleClick={onCancelButtonClick}
          />
        )}
      </div>
    </div>
  </div>
);
};