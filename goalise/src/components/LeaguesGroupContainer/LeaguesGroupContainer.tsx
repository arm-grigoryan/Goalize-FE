"use client";
import styles from "./LeaguesGroupContainer.module.css";
import { groupCardData } from "./constants/group";
import GroupCard from "@/entities/GroupCard";

export const LeaguesGroupContainer = () => {
  return (
    <div className={styles.group_card}>
      <GroupCard groupCardContent={groupCardData} groupName="GROUP A" />
      <GroupCard groupCardContent={groupCardData} groupName="GROUP B" />
      <GroupCard groupCardContent={groupCardData} groupName="GROUP C" />
      <GroupCard groupCardContent={groupCardData} groupName="GROUP D" />
    </div>
  );
};
