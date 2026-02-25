import { useEffect, useMemo, useState, useRef } from "react";
import { useLazyGetSearchAutoCompleteQuery } from "@/app/store/services/api";
import type { SearchItem } from "@/types/api/search";

export function useSearchAutoComplete(query: string) {
  const [activeTab, setActiveTab] = useState<
    "all" | "leagues" | "teams" | "players"
  >("all");
  const [trigger, { data, isFetching, error }] =
    useLazyGetSearchAutoCompleteQuery();
  const debounceRef = useRef<number | null>(null);
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    const q = query.trim();
    if (debounceRef.current) window.clearTimeout(debounceRef.current);

    if (q.length < 1) {
      lastQueryRef.current = "";
      return;
    }

    debounceRef.current = window.setTimeout(() => {
      if (lastQueryRef.current === q) return;
      lastQueryRef.current = q;
      trigger(q);
    }, 300);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, trigger]);

  const results = useMemo(() => {
    const leagues: SearchItem[] = (data?.leagues || []).map((item) => ({
      ...item,
      type: "league",
    }));
    const teams: SearchItem[] = (data?.teams || []).map((item) => ({
      ...item,
      type: "team",
    }));
    const players: SearchItem[] = (data?.players || []).map((item) => ({
      ...item,
      type: "profile",
    }));
    const all: SearchItem[] = [...leagues, ...teams, ...players].sort(
      (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
    );
    return { leagues, teams, players, all };
  }, [data]);

  return {
    activeTab,
    setActiveTab,
    results,
    isLoading: isFetching,
    error,
  };
}
