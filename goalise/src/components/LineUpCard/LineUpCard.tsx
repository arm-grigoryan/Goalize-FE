import LineUpInnerCard from '../LineUpInnerCard';
import styles from './LineUpCard.module.css';
import { IMatchlineUp } from '@/types/api/matchLineUps';

interface ILineUpCardProps {
  players: IMatchlineUp[];
  onPlayerClick: (player: IMatchlineUp) => void;
}

export const LineUpCard: React.FC<ILineUpCardProps> = ({ players, onPlayerClick }) => {
  return (
    <div className={styles.container}>
      {players.map((player) => (
        <LineUpInnerCard
          key={player.id}
          playerImage={player.picture}
          playerName={`${player.firstName} ${player.lastName}`}
          playerNumber={player.shirtNumber}
          onClick={() => onPlayerClick(player)}
        />
      ))}
    </div>
  );
};
