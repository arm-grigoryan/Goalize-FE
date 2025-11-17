import { IMatchListprops } from "./MatchList.types";
import styles from './MatchList.module.css';
import MatchCard from "../MatchCard/MatchCard";
import Scroll from "@/shared/Scroll/Scroll";
const MatchList: React.FC<IMatchListprops> = ({
    title,
    object
}) => {
    return <div className={styles.container}>
                <div className={styles.title}> {title} </div>
                <>
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
                </>
         </div>
}

MatchList.displayName = 'MatchList';
export default MatchList;