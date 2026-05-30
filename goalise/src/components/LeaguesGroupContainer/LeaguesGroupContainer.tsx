"use client";
import styles from "./LeaguesGroupContainer.module.css";
import GroupCard from "@/entities/GroupCard";
import { useGetLeagueGroupsQuery } from "@/app/store/services/api";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import emptyStateImage from '../../assets/pngs/highlightsEmpty.svg';

export const LeaguesGroupContainer = () => {
  const { leagueId } = useParams();
  const { data: groupsData, isLoading: isLoadingGroups } =
    useGetLeagueGroupsQuery(Number(leagueId));
  const t = useTranslations("leagues");
  const hasGroups =
    groupsData && Object.keys(groupsData).length > 0;

  if (!hasGroups) {
    return (
      <div className={styles.emptyState}>
        <Image src={emptyStateImage} alt="No groups" width={64} height={64} className={styles.emptyImage}/>

        <div className={styles.emptyTitle}>
          Groups are not formed yet
        </div>
      </div>
    );
  }
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
      {!groupsData && <div>{t("groupsUnavailable")}</div>}
    </div>
  );
};
