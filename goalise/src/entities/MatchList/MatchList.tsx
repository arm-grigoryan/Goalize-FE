import { IMatchListprops } from "./MatchList.types";
import styles from './MatchList.module.css';
import MatchCard from "../MatchCard/MatchCard";
import Scroll from "@/shared/Scroll/Scroll";
import Image from "next/image";
import matchesIcon from '../../assets/pngs/matches.png';
import en from '../../../messages/en.json';
import matchEmptyState from '../../assets/pngs/matchEmptyState.png';

const MatchList: React.FC<IMatchListprops> = ({
    object
}) => {
    return <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <div className={styles.iconWrapper}> 
                <Image src={matchesIcon} alt=""  className={styles.icon}/>
                </div>
                <div className={styles.titleContainer}>
                    <div className={styles.title }> {en.playerProfile.pastMatches.title} </div>
                    <div className={styles.label}> {en.playerProfile.pastMatches.label}</div>
                </div>
            </div>
                <div>
                    {!object && <div className={styles.emptyState}> 
                        <Image  src={matchEmptyState} alt=""/>
                        <div className={styles.emptyText}>{en.playerProfile.pastMatches.emptyStateText}</div>
                    </div>}
                <Scroll maxHeight="364px"> 
                    {object?.map((obj, i)=> {
                        return <MatchCard 
                                key={i}
                                fisrtTeamName={obj.fisrtTeamName}
                                firstTeamNameValue={obj.firstTeamNameValue}
                                secondTeamName={obj.secondTeamName}
                                secondTeamNameValue={obj.secondTeamNameValue}
                                date={obj.date}
                                goalsCount={obj.goalsCount}
                                peopleCount={obj.peopleCount}
                                redCardsCount={obj.redCardsCount}
                                yellowCardsCount={obj.yellowCardsCount}
                        />
                    })}
                    </Scroll>
                </div>
         </div>
}

MatchList.displayName = 'MatchList';
export default MatchList;