"use client";
import styles from "./HomeTransferNewsCard.module.css";
import Button from "@/shared/Button";
import transferIcon from "../../assets/pngs/homeTransferIcon.png";
import Title from "@/shared/Title";
import TransferInnerCard from "../../entities/TransferInnerCard";
import playerImg from "../../assets/pngs/teamLogo.png";
import { useGetTransferNewsQuery } from "@/app/store/services/api";
import { useEffect, useRef, useState } from "react";
import { ITransfers } from "@/types/api/transfers";
import { handleLongStrings } from "@/helper/handleLongStrings";
import { useTranslations } from "next-intl";

export const HomeTransferNewsCard = () => {
  const t = useTranslations();

  const [offset, setOffset] = useState<number>(0);
  const [transfers, setTransfers] = useState<ITransfers[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const { data, isFetching } = useGetTransferNewsQuery(
    { take: 10, skip: offset },
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
      if (data.length < 5) {
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
        setOffset((prev) => prev + 5);
      }
    };

    const container = scrollContainerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [isFetching]);

  const buttonClick = () => {
    console.log("clicked");
  };
  return (
    <div
      className={
        transfers?.length ? styles.transfer_news : styles.transfer_news_empty
      }
    >
      <div className={styles.button_and_title_wrapper}>
        <div className={styles.button_wrapper}>
          <Button
            className="icon_button"
            handleClick={buttonClick}
            icon={transferIcon}
          />
        </div>
        <div className={styles.title_wrapper}>
          <Title content={t("home.transferNews.title")} />
        </div>
      </div>

      {!transfers?.length && (
        <div className={styles.no_transfer_wrapper}>
          <span className={styles.no_transfer_text}>
            No transfer news is scheduled at the moment
          </span>
        </div>
      )}
      <div ref={scrollContainerRef} className={styles.transfer_wrapper}>
        {transfers.map((transfer) => {
          const date = new Date(transfer.transferDate).toLocaleDateString();
          return (
            <TransferInnerCard
              key={transfer.id}
              playerImage={playerImg}
              PlayerName={`${transfer.firstName} ${transfer.lastName}`}
              transferDate={date}
              teamLogoFrom={playerImg}
              teamNameFrom={handleLongStrings(transfer.fromTeam.name, 8)}
              teamNameFromTooltip={transfer.fromTeam.name}
              teamLogoTo={playerImg}
              teamNameTo={handleLongStrings(transfer.toTeam.name, 8)}
              teamNameToTooltip={transfer.toTeam.name}
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
  );
};
