"use client";
import styles from "./LeaguesGroupContainer.module.css";
import GroupCard from "@/entities/GroupCard";
import { useGetLeagueGroupsQuery } from "@/app/store/services/api";
import { useParams } from "next/navigation";

export const LeaguesGroupContainer = () => {
  const { leagueId } = useParams();
  const { data: groupsData, isLoading: isLoadingGroups } =
    useGetLeagueGroupsQuery(Number(leagueId));

  return (
    <div className={styles.group_card}>
      {groupsData &&
        Object.entries(groupsData).map(([groupName, groupContent]) => (
          <GroupCard
            key={groupName}
            groupCardContent={groupContent}
            groupName={groupName}
          />
        ))}
      {isLoadingGroups && (
        <div className={styles.loader_container}>
          <div className={styles.loader}></div>
        </div>
      )}
      {!groupsData && <div>Groups data unavailable.</div>}
    </div>
  );
};
