import Image, { StaticImageData } from "next/image";
import styles from './MatchesHighlitsCard.module.css';
import tshirt from '../../assets/pngs/tshirt.svg'
import CustomDivider from "@/shared/Divider";
import ballIcon from '../../assets/pngs/ballIcon.svg';
import card from '../../assets/pngs/card.svg';
import Link from "next/link";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
export interface IMatchesHighlitsCardProps { 
    swapped?: boolean;
    playerNumber?: number;
    playerImage?: StaticImageData;
    playerName?: string;
    assistName?: string;
    goal?: boolean;
    redGard?: boolean;
    yellowCard?: boolean;
    selfGoal?: boolean;
}
export const MatchesHighlitsCard: React.FC<IMatchesHighlitsCardProps> = ({
  playerNumber,
  playerImage,
  playerName,
  assistName,
  goal,
  redGard,
  yellowCard,
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

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ''} ${swapped ? styles.swapped : ''}`}>
      {!isMobile && !swapped && renderShirt()}

      {swapped && (
          <div className={styles.swappedWrapper}>
          {goal && renderGoal()}
          {redGard && renderRedCard()}
          {yellowCard && renderYellowCard()}
           {isMobile && assistName && swapped && (
               <div className={styles.assistWrapper}>
            <div className={styles.assistInfoWrapper}>
              <span>Assist By</span>
              <Link href="#" className={styles.assistName}>{assistName}</Link>
            </div>
          </div>
        )}
        </div>
      )}
    {isMobile && swapped && <CustomDivider orientation="horizontal" flexItem />}

      <div className={styles.infoWrapper}>
        <div className={styles.playerInfoWrapper}>
          {playerImage && <Image src={playerImage} alt="" className={styles.playerImage} />}
          <Link href="#" className={styles.playerName}>{playerName}</Link>
        </div>

        {isMobile && renderShirt()}

        {!isMobile && assistName && !swapped && (
          <div className={styles.assistWrapper}>
            <div className={styles.assistInfoWrapper}>
              <span>Assist By</span>
              <Link href="#" className={styles.assistName}>{assistName}</Link>
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
              <Link href="#" className={styles.assistName}>{assistName}</Link>
            </div>
          </div>
        )}

        {!swapped && (
          <>
            {goal && renderGoal()}
            {redGard && renderRedCard()}
            {yellowCard && renderYellowCard()}
          </>
        )}

        {!isMobile && swapped && renderShirt()}
      </div>
    </div>
  );
};