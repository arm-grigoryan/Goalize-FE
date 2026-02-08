"use client";
import Image from "next/image";
import styles from "./DrowStandings.module.css";
import bigVsIcon from "../../assets/pngs/bigVsIcon.svg";
import separator from "../../assets/pngs/separator.svg";
import separatorBig from "../../assets/pngs/separatorBig.svg";
import separator16 from '../../assets/pngs/separator16.svg'
import { MatchWithCount, useDrowStandings } from "./useDrowStandings";
import ChampionCard from "../ChampionCard";
import { useEffect, useState } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import tbdIcon from '../../assets/pngs/tbdIcon.svg';

export const DrowStandings = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const { leftBlock, rightBlock, finalMatch } = useDrowStandings();

  const finalMatchData =
    finalMatch?.[0] && typeof finalMatch[0] === "object"
      ? Object.values(finalMatch[0]).find(
          (value: MatchWithCount) => value?.homeTeam && value?.awayTeam
        )
      : null;

  const maxMatchCount =
    leftBlock.length > 0
      ? Math.max(...leftBlock.map((m) => m.matchCount))
      : 0;
    const useResponsiveSpacing = () => {
  const [spacing, setSpacing] = useState(80);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 758) setSpacing(200);
      else if (w < 1090) setSpacing(18);
      else if (w < 1224) setSpacing(28);
      else setSpacing(80);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return spacing;
};

const spacing = useResponsiveSpacing();

  const getMarginForRound = (matchCount: number) => {
    if (maxMatchCount === 0) return 0;

    let roundIndex = 0;
    let currentCount = maxMatchCount;

    while (currentCount > matchCount) {
      currentCount = Math.floor(currentCount / 2);
      roundIndex++;
    }

    return roundIndex * spacing;
  };

  const splitBlock = (block: MatchWithCount[]) => {
    const centerIndex = block.findIndex((m) => m.matchCount === 2);
    return {
      top: block.slice(0, centerIndex),
      middle: centerIndex !== -1 ? block[centerIndex] : null,
      bottom: block.slice(centerIndex + 1),
    };
  };

  const groupByCount = (arr: MatchWithCount[], count: number) =>
    arr.filter((m) => m.matchCount === count);

  const renderMatch = (match: MatchWithCount, side: "left" | "right") => {
    const matchData = Object.values(match).find(
      (v: MatchWithCount) => v?.homeTeam && v?.awayTeam
    );
  const displayData = matchData || match;
  console.log(displayData)
    return (
      !isMobile ? 
      <div
        key={displayData.id}
        className={`${side === "left" ? styles.matchWrapperLeft : styles.matchWrapper}`}
        style={
          side === "left"
            ? { marginLeft: `${getMarginForRound(match.matchCount)}px` }
            : { marginRight: `${getMarginForRound(match.matchCount)}px` }
        }
      >
        <div
          className={`${styles.match} ${
            displayData.homeTeamScore > displayData.awayTeamScore
              ? styles.winner
              : displayData.homeTeamScore === displayData.awayTeamScore
              ? styles.noOne
              : styles.winner2
          }`}
        >
          <div
            className={`${styles.team} ${
              displayData.homeTeamScore < displayData.awayTeamScore
                ? styles.loserText
                : ""
            }`}
          >
            {displayData.homeTeam.name === 'TBD' && <Image src={tbdIcon} alt="" className={styles.tbdIcon} /> }
            {!(displayData.homeTeam.name === 'TBD') && <Image src={displayData.homeTeam.logoSrc} alt="" className={styles.teamLogo} />}
            {displayData.homeTeam.name.slice(0, 3).toUpperCase()}
            <div className={styles.score}>
              {displayData.homeTeam.name === 'TBD' ? '' : displayData.homeTeamScore >= 0 && ` ${displayData.homeTeamScore}`}
            </div>
          </div>

          
           {displayData.homeTeam.name === 'TBD' ? (
                <Image src={bigVsIcon} alt="" className={styles.tbdVSDesktop}/>
              ) : displayData.isLive ? (
                <span className={styles.liveDot}></span>
              ) : (
                <div className={styles.line}>-</div>
              )}

          <div
            className={`${styles.team} ${
              displayData.homeTeamScore > displayData.awayTeamScore
                ? styles.loserText
                : ""
            }`}
          >
            <div className={styles.score2}>
              {displayData.awayTeam.name === 'TBD' ? '' : displayData.awayTeamScore >= 0 && ` ${displayData.awayTeamScore}`}
            </div>
            {displayData.awayTeam.name.slice(0, 3).toUpperCase()}
            {displayData.awayTeam.name === 'TBD' && <Image src={tbdIcon} alt="" className={styles.tbdIconSwapped} /> }
            {!(displayData.awayTeam.name === 'TBD') && <Image src={displayData.awayTeam.logoSrc} alt="" className={styles.teamLogoSwapped} />}
          </div>
        </div>
      </div>
      : 
      <div className={styles.mobileContainer}>
       <div
          className={`${styles.matchMobile} ${
            displayData.homeTeamScore > displayData.awayTeamScore
              ? styles.winner
              : displayData.homeTeamScore === displayData.awayTeamScore
              ? styles.noOne
              : styles.winner2
          }`}
        >
          <div
            className={`${styles.teamMobile} ${
              displayData.homeTeamScore < displayData.awayTeamScore
                ? styles.loserText
                : ""
            }`}
          >
            {!(displayData.homeTeam.name === 'TBD') && <Image src={displayData.homeTeam.logoSrc} alt="" className={styles.teamLogoMobile} />}
            {displayData.homeTeam.name === 'TBD' &&  <Image src={tbdIcon} alt="" className={styles.tbdIconMobile} /> }
            {displayData.homeTeam.name.slice(0, 3).toUpperCase()}
            <div className={styles.scoreMobile}>
              {displayData.homeTeam.name === 'TBD' ? '' : displayData.homeTeamScore >= 0 && ` ${displayData.homeTeamScore}`}
            </div>
          </div>

          <div className={styles.line}>
            {displayData.homeTeam.name === 'TBD' ? (
                <Image src={bigVsIcon} alt="" className={styles.tbdVSMobile}/>
              ) : displayData.isLive ? (
                <span className={styles.liveDot}></span>
              ) : (
                '-'
              )}
            </div>
          <div
            className={`${styles.team2Mobile} ${
              displayData.homeTeamScore > displayData.awayTeamScore
                ? styles.loserText
                : ""
            }`}
          >
            {displayData.awayTeam.name === 'TBD' && <Image src={tbdIcon} alt="" className={styles.tbdIconMobileSwapped} />}
            {!(displayData.awayTeam.name === 'TBD') && <Image src={displayData.awayTeam.logoSrc} alt="" className={styles.teamLogoSwappedMobile} />}
            {displayData.awayTeam.name.slice(0, 3).toUpperCase()}
            <div className={styles.score2Mobile}>
              {displayData.awayTeam.name === 'TBD' ? '' : displayData.awayTeamScore >= 0 && ` ${displayData.awayTeamScore}`}
            </div>
          </div>
        </div>
      </div>
    );
  };
    const renderMobileTop = (block: MatchWithCount[]) => {
      const top16 = block.filter(m => m.matchCount === 16)
      const top8 = block.filter(m => m.matchCount === 8);
      const top4 = block.filter(m => m.matchCount === 4);
      const top2 = block.filter(m => m.matchCount === 2);
      console.log(top16)
      return (
        <>
        <div className={styles.mobileRow}> 
          {top16.map(m => renderMatch(m, "left"))}
        </div>
          <div className={styles.mobileRow}>
            {top8.map(m => renderMatch(m, "left"))}
          </div>

          <div className={styles.mobileColumn}>
            {top4.map(m => renderMatch(m, "left"))}
          </div>

          <div className={styles.mobileColumn}>
            {top2.map(m => renderMatch(m, "left"))}
          </div>
        </>
      );
    };
    const renderMobileFinal = () => {

      return (
       finalMatchData ? ( 
        <>
        {finalMatchData?.homeTeam?.name && (
          <ChampionCard
            teamName={finalMatchData.homeTeam.name}
            logoSrc={finalMatchData.homeTeam.logo}
            type="draw"
          />
        )}
       <div className={styles.final}>
          <div className={styles.circle}>
            <div className={styles.finalTeam}>
              {finalMatchData.homeTeam.name.slice(0, 3).toUpperCase()}
              <div>{finalMatchData.homeTeamScore}</div>
            </div>

            <Image src={bigVsIcon} alt="VS" className={styles.vs}/>

            <div className={styles.finalTeam}>
              {finalMatchData.awayTeam.name.slice(0, 3).toUpperCase()}
              <div>{finalMatchData.awayTeamScore}</div>
            </div>
          </div>
        </div></>
      ) : finalMatch?.[0] ? (
            <div className={styles.final}>
                <div className={styles.circle}>
                    <div className={styles.finalTeam}>
                        <Image src={tbdIcon} alt="" className={styles.tbdIcon} />
                    </div>

                    <div className={styles.vsWrapper}>
                        <Image src={bigVsIcon} alt="VS" className={styles.vs} />
                    </div>

                    <div className={styles.finalTeam}>
                        <Image src={tbdIcon} alt="" className={styles.tbdIcon}/>
                    </div>
                </div>
            </div>
        ) : null 
      );
    }
    const renderMobileBottom = (block: MatchWithCount[]) => {
      const bottom2 = block.filter(m => m.matchCount === 2);
      const bottom4 = block.filter(m => m.matchCount === 4);
      const bottom8 = block.filter(m => m.matchCount === 8);
      const bottom16 = block.filter(m => m.matchCount === 16);
      return (
        <>
          <div className={styles.mobileColumn}>
            {bottom2.map(m => renderMatch(m, "right"))}
          </div>

          <div className={styles.mobileColumn}>
            {bottom4.map(m => renderMatch(m, "right"))}
          </div>

          <div className={styles.mobileRow}>
            {bottom8.map(m => renderMatch(m, "right"))}
          </div>
          <div className={styles.mobileRow}>
            {bottom16.map(m => renderMatch(m, "right"))}
          </div>
        </>
      );
    };

  const renderSide = (block: MatchWithCount[], side: "left" | "right") => {
    const { top, middle, bottom } = splitBlock(block);

    const top16 = groupByCount(top, 16);
    const top8 = groupByCount(top, 8);
    const top4 = groupByCount(top, 4);

    const bottom4 = groupByCount(bottom, 4);
    const bottom8 = groupByCount(bottom, 8);
    const bottom16 = groupByCount(bottom, 16);

    return (
      <>
        {/* TOP 16 */}
        {top16.length > 0 && (
          <div className={`${styles.wrapper} ${
                              side === "right" ? styles.wrapperRight : ""
                            }`}>  
          <div className={styles.group16}>
            {top16.map((m) => renderMatch(m, side))}
          </div>
          <div className={styles.separatorBiggestWrapper}> 
            <div className={styles.separatorWrapper}> 
              <Image 
                src={separatorBig} alt="" width={46}
                height={40}
                className={styles.separatorBiggest}
              />
            </div>
            <div className={styles.imgWrapper}><Image src={separator16} alt="" className={styles.separator}/></div>
            <div className={styles.imgWrapper}><Image src={separator16} alt="" className={styles.separator}/></div>
            <div className={styles.imgWrapper}><Image src={separator16} alt="" className={styles.separator}/></div>
          </div>
          </div>
        )}

        {/* TOP 8 */}
        {top8.length > 0 && (
          <div className={`${styles.wrapper} ${
                              side === "right" ? styles.wrapperRight : ""
                            }`}> 
          <div className={styles.group8}>
            {top8.map((m) => renderMatch(m, side))}
          </div>
           <div className={styles.separatorBigWrapper}> 
            <Image src={separatorBig} alt="" className={styles.separatorBig} />
            <Image src={separator} alt="" className={styles.separator}/>
          </div>
          </div>
        )}

        {/* TOP 4 */}
        {top4.length > 0 && (
          <div
            className={`${styles.wrapper} ${
              side === "right" ? styles.wrapperRight : ""
            }`}
          >
            <div className={styles.group4}>
              {bottom4.map((m) => renderMatch(m, side))}
            </div>

            <div className={styles.separatorSmallWrapper}>
              <Image
                src={separator}
                alt=""
                className={styles.separatorSmall}
              />
            </div>
          </div>
        )}

        {/* MIDDLE */}
        {middle && renderMatch(middle, side)}

        {/* BOTTOM 4 */}
        {bottom4.length > 0 && (
          <div
            className={`${styles.wrapperSwapped} ${
              side === "right" ? styles.wrapperRightSwapped : ""
            }`}
          >
            <div className={styles.group4}>
              {bottom4.map((m) => renderMatch(m, side))}
            </div>

            <div className={styles.separatorSmallWrapper}>
              <Image
                src={separator}
                alt=""
                className={styles.separatorSmall}
              />
            </div>
          </div>
        )}

        {/* BOTTOM 8 */}
        {bottom8.length > 0 && (
         <div className={`${styles.wrapperSwapped} ${
                              side === "right" ? styles.wrapperRightSwapped : ""
                            }`}>  
          <div className={styles.group8}>
            {bottom8.map((m) => renderMatch(m, side))}
          </div>
          <div className={styles.separatorBigWrapperSwapped}> 
            <Image src={separatorBig} alt="" className={styles.separatorBig} />
            <Image src={separator} alt="" className={styles.separator}/>
            </div>
          </div>
        )}

        {/* BOTTOM 16 */}
        {bottom16.length > 0 && (
          <div className={`${styles.wrapperSwapped} ${
                              side === "right" ? styles.wrapperRightSwapped : ""
                            }`}> 
          <div className={styles.group16}>
            {bottom16.map((m) => renderMatch(m, side))}
          </div>
          <div className={styles.separatorBiggestWrapper}> 
            <div className={styles.separatorWrapper}> 
              <Image 
                src={separatorBig} alt="" width={46}
                height={40}
                className={styles.separatorBiggest}
              />
            </div>
            <div className={styles.imgWrapper}><Image src={separator16} alt="" className={styles.separator}/></div>
            <div className={styles.imgWrapper}><Image src={separator16} alt="" className={styles.separator}/></div>
            <div className={styles.imgWrapper}><Image src={separator16} alt="" className={styles.separator}/></div>
          </div>
          </div>
        )}
      </>
    );
  };

  return (
    !isMobile ? 
    <div className={styles.container}>
      <div className={styles.leftBlock}>{renderSide(leftBlock, "left")}</div>

      <div className={styles.circleBlock}>
        {finalMatchData?.homeTeam?.name && (
          <ChampionCard
            teamName={finalMatchData.homeTeam.name}
            logoSrc={finalMatchData.homeTeam.logo}
            type="draw"
          />
        )}

           <div className={styles.final}>
              {finalMatchData ? (
                <div className={styles.circle}>
                  <div className={styles.finalTeam}>
                    {finalMatchData.homeTeam.name.slice(0, 3).toUpperCase()}
                    <div> 
                      {finalMatchData.homeTeamScore >= 0 &&
                      ` ${finalMatchData.homeTeamScore}`}
                    </div>
                  </div>
                  <div className={styles.vsWrapper}>
                    <Image src={bigVsIcon} alt="VS" className={styles.vs} />
                  </div>
                  <div className={styles.finalTeam}>
                    {finalMatchData.awayTeam.name.slice(0, 3).toUpperCase()}
                    <div>
                      {finalMatchData.awayTeamScore >= 0 &&
                        ` ${finalMatchData.awayTeamScore}`}
                    </div>
                  </div>
                </div> ) : finalMatch?.[0] ? (
                            <div className={styles.circle}>
                              <div className={styles.finalTeam}>
                                 <Image src={tbdIcon} alt="" className={styles.tbdIcon}/>
                              </div>

                              <div className={styles.vsWrapper}>
                                <Image src={bigVsIcon} alt="VS" className={styles.vs} />
                              </div>

                              <div className={styles.finalTeam}>
                               <Image src={tbdIcon} alt="" className={styles.tbdIcon}/>
                              </div>
                            </div>
                          ) : null }
          </div> 
      </div>
      <div className={styles.rightBlock}>{renderSide(rightBlock, "right")}</div>
    </div> : 
    <div className={styles.mobileContainer}>
      {renderMobileTop(leftBlock)}
      {renderMobileFinal()}
      {renderMobileBottom(rightBlock)}
    </div>
  );
};
