
import LineUpInnerCard from '../LineUpInnerCard';
import styles from './LineUpCard.module.css';
import teamLogo from '../../assets/pngs/teamLogo.png';

export const LineUpCard: React.FC= () => {
    return <div className={styles.container}>
            <LineUpInnerCard 
                playerImage={teamLogo}
                playerName={'Vruyr Saghatelyan'}
                playerNumber={23}
            />
            <LineUpInnerCard 
                playerImage={teamLogo}
                playerName={'Vruyr Saghatelyan'}
                playerNumber={23}
            /><LineUpInnerCard 
                playerImage={teamLogo}
                playerName={'Vruyr Saghatelyan'}
                playerNumber={23}
            /><LineUpInnerCard 
                playerImage={teamLogo}
                playerName={'Vruyr Saghatelyan'}
                playerNumber={23}
            />
    </div>
}