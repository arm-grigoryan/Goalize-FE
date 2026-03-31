"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from './TeamTransfer.module.css';
import TeamTransferCard from "../TeamTransferCard";
import { useParams, usePathname } from "next/navigation";
import { useGetTeamTransfersQuery } from "@/app/store/services/api";
import { ITeamTransfer } from "@/types/api/transfers";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

const PAGE_SIZE = 10;

type Tab = "All" | "In" | "Out";

export const TeamTransfer = () => {
  const { teamId } = useParams();
  const teamIdNum = Number(teamId);
  const pathname = usePathname();
  const { width } = useWindowSize()
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [offset, setOffset] = useState<number>(0);
  const [transfers, setTransfers] = useState<ITeamTransfer[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useGetTeamTransfersQuery(
    { teamId: teamIdNum, skip: offset, take: PAGE_SIZE },
    { skip: !teamId }
  );

  useEffect(() => {
    setOffset(0);
    setTransfers([]);
    setHasMore(true);
  }, [pathname]);

  useEffect(() => {
    if (data) {
      setTransfers((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newItems = data.filter((t) => !existingIds.has(t.id));
        return [...prev, ...newItems];
      });
      if (data.length < PAGE_SIZE) setHasMore(false);
    }
  }, [data, offset]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || isFetching) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight && hasMore) {
        setOffset((prev) => prev + PAGE_SIZE);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  const visibleTransfers =
    activeTab === "All"
      ? transfers
      : transfers.filter((t) =>
          activeTab === "In" ? t.transferType === "In" : t.transferType === "Out"
        );

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.tabsContainer}>
        <div
          className={`${styles.tab} ${activeTab === "All" ? styles.isActive : ""}`}
          onClick={() => setActiveTab("All")}
        >
          All
        </div>
        <div
          className={`${styles.tab} ${activeTab === "In" ? styles.isActive : ""}`}
          onClick={() => setActiveTab("In")}
        >
          Player In
        </div>
        <div
          className={`${styles.tab} ${activeTab === "Out" ? styles.isActive : ""}`}
          onClick={() => setActiveTab("Out")}
        >
          Player Out
        </div>
      </div>

      <div ref={scrollContainerRef} className={styles.scrollContainer}>
        <div className={styles.transfers}>
          {visibleTransfers.map((transfer) => {
            const isIn = transfer.transferType === "In";
            const relevantTeam = isIn ? transfer.fromTeam : transfer.toTeam;
            return (
              <TeamTransferCard
                key={transfer.id}
                date={formatUTCDate(transfer.transferDate)}
                playerLogo={transfer.playerPicture}
                playerName={`${transfer.firstName} ${transfer.lastName}`}
                playerId={transfer.playerId}
                teamLogo={relevantTeam.logoUrl}
                teamName={relevantTeam.name}
                teamId={relevantTeam.id}
                playerIn={isIn}
              />
            );
          })}
        </div>
        {isFetching && (
          <div className={styles.loaderContainer}>
            <div className={styles.loader} />
          </div>
        )}
      </div>
    </div>
  );
};
