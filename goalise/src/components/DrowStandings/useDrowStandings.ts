import { useGetLeaguesDrawQuery } from "@/app/store/services/api";
import { Match, root } from "@/types/api/drowStandings";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export type MatchWithCount = Match & { matchCount: number };

const createEmptyMatch = (id: number): Match => ({
  id,
  homeTeam: { id: 0, name: "TBD", logoSrc: "", captainId: 0 },
  awayTeam: { id: 0, name: "TBD", logoSrc: "", captainId: 0 },
  homeTeamScore: 0,
  awayTeamScore: 0,
  homeTeamPoints: 0,
  awayTeamPoints: 0,
  isLive: false,
  date: "",
  state: "pending",
  result: "",
});

const fillMissingRounds = (drawData: root[]): root[] => {
  if (!drawData || drawData.length === 0) return [];

  const maxMatchCount = Math.max(
    ...drawData.map((round) => round.matchesCount)
  );

  const existingRounds = new Map<number, root>();
  drawData.forEach((round) => {
    existingRounds.set(round.matchesCount, round);
  });

  const completeRounds: root[] = [];
  let currentMatchCount = maxMatchCount;
  let matchIdCounter = 10000;
  while (currentMatchCount >= 1) {
    const existingRound = existingRounds.get(currentMatchCount);

    if (existingRound) {
      const expectedMatchCount = currentMatchCount;
      const actualMatchCount = existingRound.matches.length;

      if (actualMatchCount < expectedMatchCount) {
        const filledMatches = [...existingRound.matches];
        for (let i = actualMatchCount; i < expectedMatchCount; i++) {
          filledMatches.push(createEmptyMatch(matchIdCounter++));
        }
        completeRounds.push({
          ...existingRound,
          matches: filledMatches,
        });
      } else {
        completeRounds.push(existingRound);
      }
    } else {
      const emptyMatches: Match[] = [];
      for (let i = 0; i < currentMatchCount; i++) {
        emptyMatches.push(createEmptyMatch(matchIdCounter++));
      }

      completeRounds.push({
        playoff: { id: 0, name: `Round of ${currentMatchCount * 2}` },
        matchesCount: currentMatchCount,
        matches: emptyMatches,
      });
    }

    currentMatchCount = Math.floor(currentMatchCount / 2);
  }

  return completeRounds;
};

const sortMatchesByMatchCount = (
  matches: MatchWithCount[]
): MatchWithCount[] => {
  const grouped: Record<number, MatchWithCount[]> = {};

  matches.forEach((match) => {
    const count = match.matchCount;
    if (!grouped[count]) {
      grouped[count] = [];
    }
    grouped[count].push(match);
  });

  const sortedCounts = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  const leftItems: MatchWithCount[] = [];
  let centerItem: MatchWithCount[] = [];
  const rightItems: MatchWithCount[] = [];

  sortedCounts.forEach((count) => {
    const items = grouped[count];

    if (count === 2) {
      centerItem = items;
    } else {
      const mid = Math.ceil(items.length / 2);
      leftItems.push(...items.slice(0, mid));
      rightItems.unshift(...items.slice(mid));
    }
  });

  return [...leftItems, ...centerItem, ...rightItems];
};

export const useDrowStandings = () => {
  const [leftBlock, setLeftBlock] = useState<MatchWithCount[]>([]);
  const [rightBlock, setRightBlock] = useState<MatchWithCount[]>([]);
  const [finalMatch, setFinalMatch] = useState<Match[]>([]);
  const { leagueId } = useParams();
  const leagueIdNum = Number(leagueId);
  const { data: drawData, isLoading } = useGetLeaguesDrawQuery(leagueIdNum, {
    skip: !leagueId,
  });

  useEffect(() => {
    if (drawData) {
      const completeDrawData = fillMissingRounds(drawData);

      const filteredRounds = completeDrawData.filter(
        (round) => round.matchesCount !== 1
      );

      completeDrawData.forEach((match) => {
        if (match.matchesCount === 1) {
          setFinalMatch(match.matches);
        }
      });

      const tempLeftBlock: MatchWithCount[] = [];
      const tempRightBlock: MatchWithCount[] = [];

      filteredRounds.forEach((round) => {
        round.matches.forEach((match, index) => {
          const matchWithCount = { ...match, matchCount: round.matchesCount };
          if (index < round.matches.length / 2) {
            tempLeftBlock.push(matchWithCount);
          } else {
            tempRightBlock.push(matchWithCount);
          }
        });
      });

      const sortedLeft = sortMatchesByMatchCount(tempLeftBlock);
      const sortedRight = sortMatchesByMatchCount(tempRightBlock);

      setLeftBlock(sortedLeft);
      setRightBlock(sortedRight);
    }
  }, [drawData]);

  return { drawData, leftBlock, rightBlock, finalMatch, isLoading };
};
