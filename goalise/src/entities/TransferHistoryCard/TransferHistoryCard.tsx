import styles from "./TransferHistory.module.css";
import Image from "next/image";
import TransferItemCard from "../TransferItemCard";
import transferHistoryIcon from "../../assets/pngs/TransferIcon.svg";
import transferEmptyState from "../../assets/pngs/transferEmptyState.png";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useTranslations } from "next-intl";
import { useGetPlayerTransferHistoryQuery } from "@/app/store/services/api";
import { useParams } from "next/navigation";
import tranferHistoryIcon from "../../assets/pngs/transferHistoryIcon.png";
import { handleLongStrings } from "@/helper/handleLongStrings";
import { useEffect, useRef, useState } from "react";
import { IPlayerTransferHistory } from "@/types/api/playerTransferHistory";

export const TransferHistoryCard = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("playerProfile.transferHistory");
  const { playerId } = useParams();

  const [offset, setOffset] = useState<number>(0);
  const [transfers, setTransfers] = useState<IPlayerTransferHistory[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useGetPlayerTransferHistoryQuery(
    { playerId: Number(playerId), skip: offset, take: 4 },
    { skip: !hasMore }
  );

  useEffect(() => {
    if (data) {
      setTransfers((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (transfer, index, self) =>
            index === self.findIndex((t) => t.id === transfer.id)
        );
        return unique;
      });

      if (data.length < 4) {
        setHasMore(false);
      }
    }
  }, [data, offset]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight) {
        setOffset((prev) => prev + 4);
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);
  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.titleWrapper}>
        <Image src={transferHistoryIcon} className={styles.icon} alt="" />
        <div className={styles.titleContainer}>
          <div className={styles.title}> {t("title")}</div>
          <div className={styles.label}>{t("label")} </div>
        </div>
      </div>
      <div ref={containerRef} className={styles.content}>
        {!transfers?.length && (
          <div className={styles.emptyState}>
            <Image src={transferEmptyState} alt="" />
            <div className={styles.emptyStateText}> {t("emptyStateText")}</div>
          </div>
        )}
        {transfers.map((obj) => {
          return (
            <TransferItemCard
              key={obj.id}
              date={new Date(obj.transferDate).toLocaleDateString()}
              fromTeamLogo={tranferHistoryIcon}
              fromTeamName={handleLongStrings(obj.fromTeam.name, 7)}
              fromTeamNameToolTip={obj.fromTeam.name}
              toTeamLogo={tranferHistoryIcon}
              toTeamName={handleLongStrings(obj.toTeam.name, 7)}
              toTeamNameToolTip={obj.toTeam.name}
            />
          );
        })}
      </div>
    </div>
  );
};
