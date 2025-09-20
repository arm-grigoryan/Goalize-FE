"use client";
import styles from "./LeaguesGroupContainer.module.css";
import GroupCard from "@/entities/GroupCard";
import {
  useGetLeagueGroupsQuery,
  useGetLeaguesQuery,
} from "@/app/store/services/api";

export const LeaguesGroupContainer = () => {
  const { data } = useGetLeaguesQuery();
  const { data: groupsData, isLoading: isLoadingGroups } =
    useGetLeagueGroupsQuery(data ? data[0].id : 0);

  console.log(groupsData, "groups data");

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
    </div>
  );
};
