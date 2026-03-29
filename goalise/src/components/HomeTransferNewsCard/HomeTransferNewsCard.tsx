"use client";
import styles from "./HomeTransferNewsCard.module.css";
import transferHistoryIcon from "../../assets/pngs/TransferIcon.svg";
import Title from "@/shared/Title";
import TransferInnerCard from "../../entities/TransferInnerCard";
import { useGetTransferNewsQuery } from "@/app/store/services/api";
import { useEffect, useRef, useState } from "react";
import { ITransfers } from "@/types/api/transfers";
import { handleLongStrings } from "@/helper/handleLongStrings";
import { useTranslations } from "next-intl";
import { formatUTCDate } from "@/helper/formatDateAndTime";
import transferEmpty from '../../assets/pngs/transferEmpty.svg';
import Image from "next/image";
export const HomeTransferNewsCard = () => {
  const t = useTranslations();
  const BATCH_SIZE = 10;
  const [offset, setOffset] = useState<number>(0);
  const [transfers, setTransfers] = useState<ITransfers[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetching } = useGetTransferNewsQuery(
    { take: BATCH_SIZE, skip: offset },
    { skip: !hasMore }
  );

  useEffect(() => {
    if (data) {
      setTransfers((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (match, index, self) =>
            index === self.findIndex((m) => m.id === match.id)
        );
        return unique;
      });
      if (data.length < BATCH_SIZE) {
        setHasMore(false);
      }
    }
  }, [data, offset]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = container;

      if (scrollTop + clientHeight >= scrollHeight - 4) {
        setOffset((prev) => prev + BATCH_SIZE);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);

  return (
    <div className={styles.border}>
      <div
        className={
          transfers?.length ? styles.transfer_news : styles.transfer_news_empty
        }
      >
        <div className={styles.button_and_title_wrapper}>
          <div className={styles.button_wrapper}>
            <Image src={transferHistoryIcon} className={styles.icon} alt="" />
          </div>
          <div className={styles.title_wrapper}>
            <Title content={t("home.transferNews.title")} />
          </div>
        </div>

        {!transfers?.length && (
          <div className={styles.no_transfer_wrapper}>
            <Image src={transferEmpty} alt="" className={styles.transfer_empty_image} />
            <span className={styles.no_transfer_text}>
              No transfer news is scheduled at the moment
            </span>
          </div>
        )}
        <div ref={scrollContainerRef} className={styles.transfer_wrapper}>
          {transfers.map((transfer) => {
            return (
              <TransferInnerCard
                key={transfer.id}
                playerImage={transfer.playerPicture}
                playerId={transfer.playerId}
                PlayerName={`${transfer.firstName} ${transfer.lastName}`}
                transferDate={formatUTCDate(transfer.transferDate)}
                teamLogoFrom={transfer.fromTeam.logoUrl}
                teamNameFrom={handleLongStrings(transfer.fromTeam.name, 8)}
                teamNameFromTooltip={transfer.fromTeam.name}
                fromTeamId={transfer.fromTeam.name?.toLowerCase() === 'free agent' ? undefined : transfer.fromTeam.id}
                teamLogoTo={transfer.toTeam.logoUrl}
                teamNameTo={handleLongStrings(transfer.toTeam.name, 8)}
                teamNameToTooltip={transfer.toTeam.name}
                toTeamId={transfer.toTeam.name?.toLowerCase() === 'free agent' ? undefined : transfer.toTeam.id}
              />
            );
          })}
          {isFetching && (
            <div className={styles.loader_container}>
              <div className={styles.loader}></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
