import { IMatchListprops } from "./MatchList.types";
import styles from './MatchList.module.css';
import MatchCard from "../MatchCard";
import Scroll from "@/shared/Scroll";
import Image from "next/image";
import matchesIcon from '../../assets/pngs/calendar.svg';
import matchEmptyState from '../../assets/pngs/matchEmptyState.png';
import { useTranslations } from "next-intl";

export const MatchList: React.FC<IMatchListprops> = ({
    object
}) => {
    const t = useTranslations("playerProfile.pastMatches");
    return <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <div className={`${styles.iconWrapper} ${styles.redGlow}`}> 
                    <Image src={matchesIcon} alt=""  className={styles.icon}/>
                </div>
                <div className={styles.titleContainer}>
                    <div className={styles.title }> {t("title")} </div>
                    <div className={styles.label}> {t("label")}</div>
                </div>
            </div>
                <div>
                    {!object && <div className={styles.emptyState}> 
                        <Image  src={matchEmptyState} alt=""/>
                        <div className={styles.emptyText}>{t("emptyStateText")}</div>
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
};