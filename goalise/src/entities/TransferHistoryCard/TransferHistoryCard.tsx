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

export const TransferHistoryCard = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("playerProfile.transferHistory");
  const { playerId } = useParams();
  const { data: playerTransferHistory } = useGetPlayerTransferHistoryQuery(
    Number(playerId)
  );
  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.titleWrapper}>
        <Image src={transferHistoryIcon} className={styles.icon} alt="" />
        <div className={styles.titleContainer}>
          <div className={styles.title}> {t("title")}</div>
          <div className={styles.label}>{t("label")} </div>
        </div>
      </div>
      <div className={styles.content}>
        {!playerTransferHistory?.length && (
          <div className={styles.emptyState}>
            <Image src={transferEmptyState} alt="" />
            <div className={styles.emptyStateText}> {t("emptyStateText")}</div>
          </div>
        )}
        {playerTransferHistory?.map((obj, i) => {
          return (
            <TransferItemCard
              key={i}
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
