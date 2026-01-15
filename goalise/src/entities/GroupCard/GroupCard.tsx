"use client";
import { ILeaguesGroupItem } from "@/types/api/leaguesGroup";
import styles from "./GroupCard.module.css";

interface GroupCardProps {
  groupCardContent: ILeaguesGroupItem[];
  groupName: string;
}

export const GroupCard = ({ groupCardContent, groupName }: GroupCardProps) => {
  const rows = groupCardContent.length;
  const minRows = 4;

  const filledRows = [
    ...groupCardContent,
    ...Array(Math.max(0, minRows - rows)).fill(null),
  ];

  return (
    <div className={styles.group_card_container}>
      <h3 className={styles.group_name}>{groupName}</h3>
      <div className={styles.group_card}>
        <table className={styles.group_card_table}>
          <thead className={styles.group_card_header}>
            <tr className={styles.header_content}>
              <div className={styles.titleWrapper}> 
                <th>#</th>
                <th className={styles.team}>Team</th>
              </div>
              <div className={styles.names_wrapper}> 
                <th>MP</th>
                <th>GD</th>
                <th className={styles.pts}>PTS</th>
              </div>
            </tr>
          </thead>
        </table>

        <div className={`${rows > minRows ? styles.scrollable : ""} ${styles.table_wrapper}`}>
          <table className={styles.group_card_table}>
            <tbody>
              {filledRows.map((card, index) => (
                <tr
                  key={card ? card.id : `empty-${index}`}
                  className={styles.group_card_content}
                >
                  {card ? (
                    <>
                      <div className={styles.position_container}> 
                        <td className={styles.index}>{index + 1}</td>
                        <td className={styles.team}>{card.team.name}</td>
                      </div>
                      <div className={styles.scores_container}> 
                        <td className={styles.scores}>{card.matchesPlayed}</td>
                        <td className={styles.scores}>{card.goalsDifference}</td>
                        <td className={styles.pts}>{card.points}</td>
                      </div>
                    </>
                  ) : (
                    <td colSpan={5}>&nbsp;</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
