import { ITransferItemCardProps } from "./TransferItemCard.types";
import styles from "./TransferItemCard.module.css";
import Image from "next/image";
import Link from "next/link";
import toArrowIcon from "../../assets/pngs/arrow.svg";
import dateIcon from "../../assets/pngs/dateIcon.svg";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export const TransferItemCard: React.FC<ITransferItemCardProps> = ({
  date,
  fromTeamLogo,
  fromTeamName,
  fromTeamId,
  toTeamLogo,
  toTeamName,
  toTeamId,
  fromTeamNameToolTip,
  toTeamNameToolTip,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.wrapper}>
        <div className={styles.dateWrapper}>
          <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
            <Image className={styles.dateIcon} src={dateIcon} alt="" />
          </div>
          <div className={styles.date}> {date} </div>
        </div>
        <div className={styles.teamContainer}>
          {fromTeamId ? (
            <Link href={`/teams/${fromTeamId}`} className={styles.teamLogoWrapper} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
              {fromTeamLogo && (
                <Image src={fromTeamLogo} alt="" className={styles.teamLogo} width={36} height={36} />
              )}
              <div className={styles.teamNameWrapper}>
                {!isMobile && <div className={styles.from}> From </div>}
                <div className={styles.teamName} title={fromTeamNameToolTip}>
                  {fromTeamName}{" "}
                </div>
              </div>
            </Link>
          ) : (
            <div className={styles.teamLogoWrapper}>
              {fromTeamLogo && (
                <Image src={fromTeamLogo} alt="" className={styles.teamLogo} width={36} height={36} />
              )}
              <div className={styles.teamNameWrapper}>
                {!isMobile && <div className={styles.from}> From </div>}
                <div className={styles.teamName} title={fromTeamNameToolTip}>
                  {fromTeamName}{" "}
                </div>
              </div>
            </div>
          )}
          <div className={styles.toArrow}>
            {toArrowIcon && (
              <Image className={styles.arrowIcon} src={toArrowIcon} alt="" />
            )}
          </div>
          {toTeamId ? (
            <Link href={`/teams/${toTeamId}`} className={styles.teamLogoWrapper} style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}>
              {toTeamLogo && (
                <Image src={toTeamLogo} alt="" className={styles.teamLogo} width={36} height={36} />
              )}
              <div className={styles.teamNameWrapper}>
                {!isMobile && <div className={styles.from}> To </div>}
                <div className={styles.teamName} title={toTeamNameToolTip}>
                  {toTeamName}
                </div>
              </div>
            </Link>
          ) : (
            <div className={styles.teamLogoWrapper}>
              {toTeamLogo && (
                <Image src={toTeamLogo} alt="" className={styles.teamLogo} width={36} height={36} />
              )}
              <div className={styles.teamNameWrapper}>
                {!isMobile && <div className={styles.from}> To </div>}
                <div className={styles.teamName} title={toTeamNameToolTip}>
                  {toTeamName}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
