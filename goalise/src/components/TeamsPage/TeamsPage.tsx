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
import PlayerInvitationCard from "@/entities/PlayerInvitationCard";
import { useGetTeamsQuery, useGetUserInfoQuery } from "@/app/store/services/api";
import { ITeamListItem } from "@/types/api/temas";
import { useAuth } from "@/shared/auth/AuthContext";
import { useTranslations } from "next-intl";

const TAKE = 20;

export const TeamsPage = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("teams");
  const tCommon = useTranslations("common");
  const text = isMobile ? "" : t("createTeam");

  const { isAuthenticated, signIn } = useAuth();
  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserInfoQuery(
    undefined,
    { skip: !isAuthenticated },
  );

  const userTeam = userInfo?.playerInfo?.team ?? null;
  const draftTeamId = userInfo?.playerInfo?.draftTeamId ?? null;
  const isCaptainOfActiveTeam =
    userTeam !== null &&
    userTeam.captainId === userInfo?.playerInfo?.id;
  const hasDraftTeam = draftTeamId !== null;
  const isPlayerInTeam = userTeam !== null && !isCaptainOfActiveTeam;

  const [open, setIsOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

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

  const handleCreateTeamClick = () => {
    if (!isAuthenticated) {
      signIn();
      return;
    }

    if (isUserInfoLoading) return;

    if (isCaptainOfActiveTeam) {
      setInfoMessage(t("cannotCreateCaptain", { teamName: userTeam!.name }));
      return;
    }

    if (hasDraftTeam) {
      setInfoMessage(t("cannotCreateDraft"));
      return;
    }

    if (isPlayerInTeam) {
      setInfoMessage(t("cannotCreateInTeam", { teamName: userTeam!.name }));
      return;
    }

    setIsOpen(true);
  };

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.wrapper}>
        <div className={styles.buttonTitleWrapper}>
          {!isMobile && (
            <div className={styles.button}>
              <div className={`${styles.iconWrapper} ${styles.redGlow}`}>
                <Image src={teamsAdditionIcon} alt="" className={styles.icon} />
              </div>
            </div>
          )}
          <div className={styles.title}>{t("title")}</div>
        </div>
        <Button
          className="icon_button_red_small"
          icon={teamsAdditionIcon}
          content={text}
          handleClick={handleCreateTeamClick}
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
        <div className={styles.errorText}>{t("failedToLoad")}</div>
      )}

      {!isFetching && !isError && !teams.length && (
        <div className={styles.emptyText}>{t("empty")}</div>
      )}

      <CreateTeamPopUp open={open} onClose={() => setIsOpen(false)} />

      {infoMessage && (
        <PlayerInvitationCard
          title=""
          description={infoMessage}
          confirmButtonText={tCommon("ok")}
          onConfirmButtonClick={() => setInfoMessage(null)}
        />
      )}
    </div>
  );
};
