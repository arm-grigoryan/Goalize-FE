import React from "react";
import styles from'./TeamOverviewNextMatch.module.css';
import Image from "next/image";
import calendarIcon from '../../assets/pngs/calendarIcon.svg';
import vsIcon from '../../assets/pngs/bigVsIcon.svg';
import teamLogo from '../../assets/pngs/teamLogo.png';
export interface ITeamOverviewNextMatchProps {
    date?: string;
}
export const TeamOverviewNextMatch: React.FC<ITeamOverviewNextMatchProps> = () => {
    return <div className={styles.container}>
            <div className={styles.buttonTitleWrapper}>
                <div className={`${styles.redButton} ${styles.redGlow}`}> 
                    <Image src={calendarIcon} alt="" className={styles.calendarIcon}/>
                </div>
                <div className={styles.title}> Next Match</div>
            </div>
            <div className={styles.matchWrapper}>
               <div className={styles.match_left_block}>
              <div className={styles.match_left_block_inner_wrapper}>
                <div>
                  <span className={styles.team_name}>
                    team name
                  </span>
                </div>
                <Image src={teamLogo} alt="" className={styles.team_logo} />
              </div>
            </div>
                <Image src={vsIcon} alt="" className={styles.vsIcon}/>
                <div className={styles.match_right_block}>
              <div className={styles.match_right_block_inner_wrapper}>
                
                <Image
                  src={teamLogo}
                  alt=""
                  className={styles.team_logo}
                />
                <div>
                  <span className={styles.team_name}>
                    Team Name
                  </span>
                </div>
              </div>
            </div>
            </div>
    </div>
}