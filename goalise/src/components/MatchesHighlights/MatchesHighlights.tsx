'use client'
import React from 'react';
import styles from './MatchesHighlights.module.css';
import Image from "next/image";
import calendarIcon from '../../assets/pngs/calendar.svg'
import matchEmptyState from '../../assets/pngs/matchEmptyState.png';
import MatchesHighlitsCard from '../MatchesHighlitsCard';
import { useWindowSize } from '@/hooks/useWindowSize';
import { MEDIA_TABLET_SMALL } from '@/constants/windowSizes';
import { useParams } from 'next/navigation';
import { useGetMatchByIdQuery } from '@/app/store/services/api';
import type { MatchHighlight } from '@/types/api/matches';

export const MatchesHighlights: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const { matchId } = useParams();

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
      <div className={styles.title}> Highlight</div>
    </div>

    {allEmpty ? (
      <Image src={matchEmptyState} alt="" />
    ) : (
      <div className={styles.highlightsWrapper}>
        {isMobile ? (
          <div className={styles.mobileList}>
            {sortedAll.map(h => <React.Fragment key={h.id}>{renderCard(h, h.isHome)}</React.Fragment>)}
          </div>
        ) : (
          <>
            {sortedAll.map(h => (
              <div key={h.id} className={styles.eventRow}>
                <div className={styles.sideLeft}>
                  {h.isHome ? renderCard(h, true) : null}
                </div>
                <div className={styles.line}>
                  <div className={styles.iconWrapper}>
                    <span className={styles.dot} />
                  </div>
                </div>
                <div className={styles.sideRight}>
                  {!h.isHome ? renderCard(h, false) : null}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    )}
  </div>;
}
