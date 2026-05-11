'use client'
import React from 'react';
import styles from './MatchesHighlights.module.css';
import Image from "next/image";
import calendarIcon from '../../assets/pngs/calendar.svg'
import highlightsEmpty from '../../assets/pngs/highlightsEmpty.svg';
import highlightsEmptyMobile from '../../assets/pngs/highlightsEmptyMobile.svg';
import MatchesHighlitsCard from '../MatchesHighlitsCard';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MEDIA_TABLET_SMALL } from '@/constants/windowSizes';
import { useParams } from 'next/navigation';
import { useGetMatchByIdQuery } from '@/app/store/services/api';
import type { MatchHighlight } from '@/types/api/matches';
import { useTranslations } from 'next-intl';

export const MatchesHighlights: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const { matchId } = useParams();
  const t = useTranslations("matches.highlights");

  const { data: match, isLoading } = useGetMatchByIdQuery(Number(matchId));

  if (isLoading || !match) return null;

  const homeHighlights = match.homeTeamHighlights ?? [];
  const awayHighlights = match.awayTeamHighlights ?? [];
  const allEmpty = homeHighlights.length === 0 && awayHighlights.length === 0;

  const sortedAll = [
    ...homeHighlights.map(h => ({ ...h, isHome: true })),
    ...awayHighlights.map(h => ({ ...h, isHome: false })),
  ].sort((a, b) => a.order - b.order);

  const renderCard = (highlight: MatchHighlight, isHome: boolean) => {
    const isGoal = highlight.type === 'Goal';
    const assistPlayer = isGoal && highlight.relatedHighlight ? highlight.relatedHighlight.player : null;
    const assistName = assistPlayer
      ? `${assistPlayer.firstName} ${assistPlayer.lastName}`
      : undefined;
    const assistHref = assistPlayer ? `/profile/${assistPlayer.playerId}` : undefined;

    return (
      <MatchesHighlitsCard
        playerNumber={highlight.player.shirtNumber}
        playerImage={highlight.player.picture}
        playerName={`${highlight.player.firstName} ${highlight.player.lastName}`}
        playerHref={`/profile/${highlight.player.playerId}`}
        assistName={assistName}
        assistHref={assistHref}
        goal={highlight.type === 'Goal'}
        redGard={highlight.type === 'RedCard'}
        yellowCard={highlight.type === 'YellowCard'}
        selfGoal={highlight.type === 'OwnGoal'}
        swapped={!isHome}
      />
    );
  };

  return <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
    <div className={styles.titleWrapper}>
      <div className={`${styles.button} ${styles.redGlow}`}>
        <Image src={calendarIcon} alt="" className={styles.icon} />
      </div>
      <div className={styles.title}> {t("title")}</div>
    </div>

    {allEmpty ? (
      <div className={styles.emptyWrapper}>
        <Image src={isMobile ? highlightsEmptyMobile : highlightsEmpty} alt="" />
        <div className={styles.emptyText}> {t("empty")} </div>
      </div>
    ) : (
      <div className={`${isMobile ? styles.mobileWrapper : styles.highlightsWrapper}` }>
        {isMobile && 
        <div className={styles.teamNamesWrapper}> 
          <div className={styles.teamName}>{match.homeTeam.name}</div>
          <div className={styles.teamName}>{match.awayTeam.name}</div>
        </div>}
        {isMobile ? (
          <div className={styles.mobileList}>
            {sortedAll.map(h => {
              const displayHome = h.type === 'OwnGoal' ? !h.isHome : h.isHome;
              return <React.Fragment key={h.id}>{renderCard(h, displayHome)}</React.Fragment>;
            })}
          </div>
        ) : (
          <>
            {sortedAll.map(h => {
              const displayHome = h.type === 'OwnGoal' ? !h.isHome : h.isHome;
              return (
                <div key={h.id} className={styles.eventRow}>
                  <div className={styles.sideLeft}>
                    {displayHome ? renderCard(h, true) : null}
                  </div>
                 {!isMobile &&  
                 <div className={styles.line}>
                    <div className={styles.iconWrapper}>
                      <span className={styles.dot} />
                    </div>
                  </div>}
                  <div className={styles.sideRight}>
                    {!displayHome ? renderCard(h, false) : null}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    )}
  </div>;
}
