import Image, { StaticImageData } from "next/image";
import styles from './MatchesHighlitsCard.module.css';
import tshirt from '../../assets/pngs/tshirt.svg'
import CustomDivider from "@/shared/Divider";
import ballIcon from '../../assets/pngs/ballIcon.svg';
import card from '../../assets/pngs/card.svg';
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import selfGoalIcon from '../../assets/pngs/selfGoal.svg';
export interface IMatchesHighlitsCardProps {
    swapped?: boolean;
    playerNumber?: number;
    playerImage?: string | StaticImageData;
    playerName?: string;
    playerHref?: string;
    assistName?: string;
    assistHref?: string;
    goal?: boolean;
    redGard?: boolean;
    yellowCard?: boolean;
    selfGoal?: boolean;
}
export const MatchesHighlitsCard: React.FC<IMatchesHighlitsCardProps> = ({
  playerNumber,
  playerImage,
  playerName,
  playerHref = "#",
  assistName,
  assistHref = "#",
  goal,
  redGard,
  yellowCard,
  selfGoal,
  swapped
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const renderShirt = () => (
    <div className={styles.shirtWrapper}>
      <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
        <Image src={tshirt} alt="" className={styles.icon} />
      </div>
      <div className={styles.playerNumber}>{playerNumber}</div>
    </div>
  );

  const renderGoal = () => (
    <div className={styles.goal}>
      {isMobile && assistName && <CustomDivider orientation="vertical" flexItem />}
      <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
        <Image src={ballIcon} alt="" className={styles.icon} />
      </div>
      Goal
    </div>
  );
 const renderSelfGoal = () => (
  <div className={styles.goal}>
    {isMobile && assistName && <CustomDivider orientation="vertical" flexItem />}
    <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
      <Image src={selfGoalIcon} alt="" className={styles.icon} />
    </div>
    Own Goal
  </div>
 );
  const renderRedCard = () => (
    <div className={styles.redCard}>
      {isMobile && assistName && <CustomDivider orientation="vertical" flexItem />}
      <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
        <Image src={card} alt="" className={styles.icon} />
      </div>
      Red Card
    </div>
  );

  const renderYellowCard = () => (
    <div className={styles.yellowCard}>
      {isMobile && assistName && <CustomDivider orientation="vertical" flexItem />}
      <div className={`${styles.iconWrapper} ${styles.yellowGlow}`}>
        <Image src={card} alt="" className={styles.icon} />
      </div>
      Yellow Card
    </div>
  );

  const mobileContainerStyle: React.CSSProperties = isMobile ? (() => {
    const direction = swapped ? 'to left' : 'to right';
    let color = 'transparent';
    if (goal || selfGoal) color = '#54a3fe83';
    else if (redGard) color = '#f53a5390';
    else if (yellowCard) color = 'rgba(245, 176, 58, 0.526)';
    return {
      backgroundImage: `linear-gradient(rgba(21, 25, 30, 0.40), rgba(21, 25, 30, 0.40)), linear-gradient(${direction}, ${color}, transparent 50%)`
    };
  })() : {};

  return (
    <div
      className={`${styles.container} ${isMobile ? styles.mobile : ''} ${swapped ? styles.swapped : ''}`}
      style={mobileContainerStyle}
    >
      {!isMobile && !swapped && renderShirt()}

      {swapped && (
        <div className={`${styles.swappedWrapper} ${isMobile && !assistName ? styles.centered : ''}`}>
          {goal && renderGoal()}
          {selfGoal && renderSelfGoal()}
          {redGard && renderRedCard()}
          {yellowCard && renderYellowCard()}
          {isMobile && assistName && swapped && (
            <div className={styles.assistWrapper}>
              <div className={`${styles.assistInfoWrapper} ${styles.assistRight}`}>
                <span>Assist By</span>
                <Link href={assistHref} className={styles.assistName}>{assistName}</Link>
              </div>
            </div>
          )}
        </div>
      )}
    {isMobile && swapped && <CustomDivider orientation="horizontal" flexItem />}

      <div className={styles.infoWrapper}>
        <div className={styles.playerInfoWrapper}>
          <span className={styles.playerLabel}>
            {goal ? 'Goal By' : redGard ? 'Red Card By' : yellowCard ? 'Yellow Card By' : selfGoal ? 'Own Goal By' : ''}
          </span>
          <div className={styles.playerNameRow}>
            {playerImage && (
              <Image
                src={playerImage as string}
                alt=""
                className={styles.playerImage}
                width={28}
                height={28}
                unoptimized={typeof playerImage === 'string'}
              />
            )}
            <Link href={playerHref} className={styles.playerName}>{playerName}</Link>
          </div>
        </div>

        {isMobile && renderShirt()}

        {!isMobile && assistName && !swapped && (
          <div className={styles.assistWrapper}>
            <div className={styles.assistInfoWrapper}>
              <span>Assist By</span>
              <Link href={assistHref} className={styles.assistName}>{assistName}</Link>
            </div>
            <CustomDivider orientation="vertical" flexItem />
          </div>
        )}
      </div>

      {isMobile && !swapped && <CustomDivider orientation="horizontal" flexItem />}

      <div className={`${styles.rightWrapper} ${isMobile && !assistName ? styles.centered : ''}`}>
        {isMobile && assistName && !swapped && (
          <div className={styles.assistWrapper}>
            <div className={styles.assistInfoWrapper}>
              <span>Assist By</span>
              <Link href={assistHref} className={styles.assistName}>{assistName}</Link>
            </div>
          </div>
        )}

        {!swapped && (
          <>
            {goal && renderGoal()}
            {selfGoal && renderSelfGoal()}
            {redGard && renderRedCard()}
            {yellowCard && renderYellowCard()}
          </>
        )}

        {!isMobile && swapped && renderShirt()}
      </div>
    </div>
  );
};
