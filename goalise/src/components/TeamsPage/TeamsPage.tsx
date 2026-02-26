"use client";
import React, { useState, useEffect } from "react";
import TeamsCard from "@/entities/TeamsCard";
import styles from "./TeamsPage.module.css";
import Image from "next/image";
import teamsAdditionIcon from "../../assets/pngs/teamsAdditionIcon.svg";
import Button from "@/shared/Button";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import CreateTeamPopUp from "@/entities/CreateTeamPopUp";
import { useGetTeamsQuery } from "@/app/store/services/api";
import { ITeamListItem } from "@/types/api/temas";

const TAKE = 8;

export const TeamsPage = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const text = isMobile ? "" : "Create Team";
  const [open, setIsOpen] = useState(false);

  const [skip, setSkip] = useState(0);
  const [teams, setTeams] = useState<ITeamListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isFetching, isError } = useGetTeamsQuery(
    { take: TAKE, skip },
    { skip: !hasMore },
  );

  useEffect(() => {
    if (data) {
      setTeams((prev) => {
        const merged = [...prev, ...data];
        const unique = merged.filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.team.id === item.team.id),
        );
        return unique;
      });
      if (data.length < TAKE) {
        setHasMore(false);
      }
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      if (isFetching || !hasMore) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= docHeight - 200) {
        setSkip((prev) => prev + TAKE);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetching, hasMore]);

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.wrapper}>
        <div className={styles.buttonTitleWrapper}>
          {!isMobile && (
            <div className={styles.button} onClick={() => setIsOpen(!open)}>
              <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                <Image src={teamsAdditionIcon} alt="" className={styles.icon} />
              </div>
            </div>
          )}
          <div className={styles.title}>Teams</div>
        </div>
        <Button
          className="icon_button_red"
          icon={teamsAdditionIcon}
          content={text}
          handleClick={() => setIsOpen(!open)}
        />
      </div>

      <div className={styles.teamsContainer}>
        {teams.map((item) => (
          <TeamsCard key={item.team.id} item={item} />
        ))}
      </div>

      {isFetching && (
        <div className={styles.loaderContainer}>
          <div className={styles.loader} />
        </div>
      )}

      {isError && (
        <div className={styles.errorText}>
          Failed to load teams. Please try again.
        </div>
      )}

      {!isFetching && !isError && !teams.length && (
        <div className={styles.emptyText}>No teams to show at the moment.</div>
      )}

      <CreateTeamPopUp open={open} onClose={() => setIsOpen(!open)} />
    </div>
  );
};
