"use client";
import styles from "./DrowStandings.module.css";

import { useDrowStandings } from "./useDrowStandings";

export const DrowStandings = () => {
  const { drawData, leftBlock, rightBlock, finalMatch } = useDrowStandings();

  console.log(drawData, "drawData");
  console.log(leftBlock, "leftBlock");
  console.log(rightBlock, "rightBlock");
  console.log(finalMatch, "finalMatch");
  const finalMatchData =
    finalMatch?.[0] && typeof finalMatch[0] === "object"
      ? Object.values(finalMatch[0]).find(
          (value) => value?.homeTeam && value?.awayTeam
        )
      : null;

  const maxMatchCount =
    leftBlock.length > 0 ? Math.max(...leftBlock.map((m) => m.matchCount)) : 0;

  const getMarginForRound = (matchCount: number) => {
    if (maxMatchCount === 0) return 0;

    let roundIndex = 0;
    let currentCount = maxMatchCount;

    while (currentCount > matchCount) {
      currentCount = Math.floor(currentCount / 2);
      roundIndex++;
    }

    return roundIndex * 50;
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftBlock}>
        {leftBlock.map((match) => {
          const matchData = Object.values(match).find(
            (value) => value?.homeTeam && value?.awayTeam
          );

          const displayData = matchData || match;

          return (
            <div
              key={displayData.id}
              className={styles.match}
              style={{ marginLeft: `${getMarginForRound(match.matchCount)}px` }}
            >
              <div className={styles.team}>
                {displayData.homeTeam.name}
                {displayData.homeTeamScore > 0 &&
                  ` ${displayData.homeTeamScore}`}
              </div>

              <div className={styles.vs}>VS</div>

              <div className={styles.team}>
                {displayData.awayTeam.name}
                {displayData.awayTeamScore > 0 &&
                  ` ${displayData.awayTeamScore}`}
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.final}>
        {finalMatchData ? (
          <>
            <div className={styles.team}>
              {finalMatchData.homeTeam.name}
              {finalMatchData.homeTeamScore > 0 &&
                ` ${finalMatchData.homeTeamScore}`}
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.team}>
              {finalMatchData.awayTeam.name}
              {finalMatchData.awayTeamScore > 0 &&
                ` ${finalMatchData.awayTeamScore}`}
            </div>
          </>
        ) : finalMatch?.[0] ? (
          <>
            <div className={styles.team}>
              {finalMatch[0].homeTeam?.name || "TBD"}
            </div>
            <div className={styles.vs}>VS</div>
            <div className={styles.team}>
              {finalMatch[0].awayTeam?.name || "TBD"}
            </div>
          </>
        ) : null}
      </div>
      <div className={styles.rightBlock}>
        {rightBlock.map((match) => {
          const matchData = Object.values(match).find(
            (value) => value?.homeTeam && value?.awayTeam
          );

          const displayData = matchData || match;

          return (
            <div
              key={displayData.id}
              className={styles.match}
              style={{
                marginRight: `${getMarginForRound(match.matchCount)}px`,
              }}
            >
              <div className={styles.team}>
                {displayData.homeTeam.name}
                {displayData.homeTeamScore > 0 &&
                  ` ${displayData.homeTeamScore}`}
              </div>

              <div className={styles.vs}>VS</div>

              <div className={styles.team}>
                {displayData.awayTeam.name}
                {displayData.awayTeamScore > 0 &&
                  ` ${displayData.awayTeamScore}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
