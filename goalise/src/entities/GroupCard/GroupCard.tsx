"use client";
import styles from "./GroupCard.module.css";
import { IGroupCard } from "@/types/groupCardContent/groupCard";

interface GroupCardProps {
  groupCardContent: IGroupCard[];
  groupName: string;
}

export const GroupCard = ({ groupCardContent, groupName }: GroupCardProps) => {
  return (
    <div className={styles.group_card_container}>
      <h3 className={styles.group_name}>{groupName}</h3>
      <div className={styles.group_card}>
        <table className={styles.group_card_table}>
          <thead className={styles.group_card_header}>
            <tr>
              <th>#</th>
              <th className={styles.team}>Team</th>
              <th>MP</th>
              <th>GD</th>
              <th className={styles.pts}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {groupCardContent.map((card, index) => (
              <tr key={card.id} className={styles.group_card_content}>
                <td>{index + 1}</td>
                <td className={styles.team}>{card.name}</td>
                <td>{card.matchPlayed}</td>
                <td>{card.goalDifference}</td>
                <td className={styles.pts}>{card.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
