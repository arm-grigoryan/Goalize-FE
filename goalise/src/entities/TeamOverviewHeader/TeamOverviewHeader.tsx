"use client";

import Link from "next/link";
import React from "react";
import styles from "./TeamOverviewHeader.module.css";
import Image from "next/image";
import Button from "@/shared/Button";
import teamLogoFallback from "../../assets/pngs/teamLogo.png";
import playerFallback from "../../assets/pngs/unassigned.png";
import edit from "../../assets/pngs/edit.svg";
import { useParams, usePathname } from "next/navigation";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useGetTeamInfoQuery } from "@/app/store/services/api";

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidBirthDate = (bd: string): boolean =>
  !bd.startsWith("0001-01-01") && !bd.startsWith("1970-01-01T00:00:00");

const calculateAge = (birthDate: string): number => {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
};

export const TeamOverviewHeader: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const { teamId } = useParams();
  const pathname = usePathname();
  const id = Number(teamId);
  const base = `/teams/${teamId}`;

  const { data: teamInfo, isLoading, isError } = useGetTeamInfoQuery(id, {
    skip: !id,
  });

  const isActive = (href: string) => {
    if (href === base) return pathname === base;
    return pathname.startsWith(href);
  };

  const captainFullName = teamInfo
    ? `${teamInfo.captain.firstName} ${teamInfo.captain.lastName}`
    : "";

  const captainAge =
    teamInfo?.captain.birthDate && isValidBirthDate(teamInfo.captain.birthDate)
      ? calculateAge(teamInfo.captain.birthDate)
      : null;

  const captainPhotoSrc =
    teamInfo?.captain.profilePic && isValidUrl(teamInfo.captain.profilePic)
      ? teamInfo.captain.profilePic
      : playerFallback;

  const teamLogoSrc =
    teamInfo?.team.logoUrl && isValidUrl(teamInfo.team.logoUrl)
      ? teamInfo.team.logoUrl
      : teamLogoFallback;

  return (
    <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.inner}>
        {/* Left: team logo + name + apply */}
        <div className={styles.name_container}>
          {isLoading ? (
            <div
              className={styles.skeleton}
              style={{ width: 130, height: 130, borderRadius: 8 }}
            />
          ) : (
            <Image
              src={teamLogoSrc}
              alt={teamInfo?.team.name ?? "Team"}
              className={styles.teamLogo}
              width={130}
              height={130}
              unoptimized
            />
          )}

          <div className={styles.name_and_button}>
            <div className={styles.nameWrapper}>
              {isLoading ? (
                <div
                  className={styles.skeleton}
                  style={{ width: 200, height: 32, borderRadius: 6 }}
                />
              ) : isError ? (
                <div className={styles.errorText}>Failed to load team info</div>
              ) : (
                <div className={styles.name}>
                  {teamInfo?.team.name}
                  {teamInfo?.team.abbreviation && (
                    <span className={styles.abbreviation}>
                      {" "}({teamInfo.team.abbreviation})
                    </span>
                  )}
                </div>
              )}
              {!isMobile && (
                <div className={styles.editButton}>
                  <Image src={edit} alt="" />
                </div>
              )}
            </div>

            <div className={styles.buttonsWrapper}>
              <Button
                handleClick={() => {}}
                content="Apply"
                className="red_button_transparant_white_text"
              />
              {isMobile && (
                <div className={styles.editButton}>
                  <Image src={edit} alt="" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: captain info + photo — skeleton */}
        {isLoading && (
          <div className={styles.infoImageWrapper}>
            <div className={styles.nameButtonWrapper}>
              <div
                className={styles.skeleton}
                style={{ width: 180, height: 36, borderRadius: 6 }}
              />
              <div className={styles.buttonsWrapper}>
                <div
                  className={styles.skeleton}
                  style={{ width: 80, height: 40, borderRadius: 10 }}
                />
                <div
                  className={styles.skeleton}
                  style={{ width: 80, height: 40, borderRadius: 10 }}
                />
                <div
                  className={styles.skeleton}
                  style={{ width: 90, height: 40, borderRadius: 10 }}
                />
              </div>
            </div>
            <div
              className={styles.skeleton}
              style={{ width: 173, height: 221, borderRadius: 14 }}
            />
          </div>
        )}

        {/* Right: captain info + photo — real data */}
        {!isLoading && teamInfo && (
          <div className={styles.infoImageWrapper}>
            <div className={styles.nameButtonWrapper}>
              <Link
                href={`/profile/${teamInfo.team.captainId}`}
                style={{ textDecoration: "none" }}
              >
                <div className={styles.playerName}>{captainFullName}</div>
              </Link>
              <div className={styles.buttonsWrapper}>
                {captainAge !== null && (
                  <div className={styles.button}>
                    <span>Age: </span>
                    {captainAge}
                  </div>
                )}
                {teamInfo.captain.workingFoot && (
                  <div className={styles.button}>
                    <span>Foot: </span>
                    {teamInfo.captain.workingFoot}
                  </div>
                )}
                <div className={styles.button}>
                  <span>Rank: </span>
                  Captain
                </div>
              </div>
            </div>

            <Link
              href={`/profile/${teamInfo.team.captainId}`}
              style={{ textDecoration: "none" }}
            >
              <Image
                src={captainPhotoSrc}
                alt={captainFullName}
                className={styles.playerImage}
                width={173}
                height={221}
                unoptimized
              />
            </Link>
          </div>
        )}
      </div>

      {/* Navigation tabs */}
      <div className={styles.links}>
        <Link
          href={base}
          className={`${styles.link} ${isActive(base) ? styles.selected : ""}`}
        >
          Overview
        </Link>
        <Link
          href={`${base}/results`}
          className={`${styles.link} ${isActive(`${base}/results`) ? styles.selected : ""}`}
        >
          Results
        </Link>
        <Link
          href={`${base}/fixtures`}
          className={`${styles.link} ${isActive(`${base}/fixtures`) ? styles.selected : ""}`}
        >
          Fixtures
        </Link>
        <Link
          href={`${base}/transfers`}
          className={`${styles.link} ${isActive(`${base}/transfers`) ? styles.selected : ""}`}
        >
          Transfers
        </Link>
        <Link
          href={`${base}/squad`}
          className={`${styles.link} ${isActive(`${base}/squad`) ? styles.selected : ""}`}
        >
          Squad
        </Link>
      </div>
    </div>
  );
};
