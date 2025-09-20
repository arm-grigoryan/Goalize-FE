"use client";
import styles from "./HomeTransferNewsCard.module.css";
import Button from "@/shared/Button";
import transferIcon from "../../assets/pngs/homeTransferIcon.png";
import Title from "@/shared/Title";
import TransferInnerCard from "../../entities/TransferInnerCard";
import playerImg from "../../assets/pngs/teamLogo.png";
import { useGetTransferNewsQuery } from "@/app/store/services/api";

export const HomeTransferNewsCard = () => {
  const { data } = useGetTransferNewsQuery();

  const buttonClick = () => {
    console.log("clicked");
  };
  return (
    <div className={styles.transfer_news}>
      <div className={styles.button_and_title_wrapper}>
        <div className={styles.button_wrapper}>
          <Button
            className="icon_button"
            handleClick={buttonClick}
            icon={transferIcon}
          />
        </div>
        <div className={styles.title_wrapper}>
          <Title content="Transfer News" />
        </div>
      </div>

      {/* <div className={styles.no_transfer_wrapper}>
        <span className={styles.no_transfer_text}>
          No transfer news is scheduled at the moment
        </span>
      </div> */}
      <div className={styles.transfer_wrapper}>
        {data?.map((transfer) => {
          const date = new Date(transfer.transferDate).toLocaleDateString();
          return (
            <TransferInnerCard
              key={transfer.id}
              playerImage={playerImg}
              PlayerName={`${transfer.firstName} ${transfer.lastName}`}
              transferDate={date}
              teamLogoFrom={playerImg}
              teamNameFrom={transfer.fromTeam.name}
              teamLogoTo={playerImg}
              teamNameTo={transfer.toTeam.name}
            />
          );
        })}
      </div>
    </div>
  );
};
