'use client'
import React from "react";
import styles from './MatchesHeader.module.css';
import CustomDivider from "@/shared/Divider";
import Image from "next/image";
import teamLogo from '../../assets/pngs/teamLogo.png';
import Link from "next/link";
import Breadcrumbs from "../Breadcrumb/Breadcrumb";
import { LiveDateLabel } from "../LiveDateLabel/LiveDateLabel";
import localFont from "next/font/local";

const chopsic = localFont({
   src: "../../../src/app/fonts/chopsic/Chopsic.otf",
})

export const MatchesHeader: React.FC = () => {
    return <div className={styles.container}>
        <div className={styles.leftPart}>
            <div className={styles.teamInfo}>
                <Image src={teamLogo} alt="Team Logo" className={styles.teamLogo}/>
                <Link href={'#'} className={styles.leagueName}> League Name</Link>
            </div>
            <CustomDivider orientation="horizontal" flexItem />
            <div className={styles.breadcrumbsWrapper}>
                <Breadcrumbs 
                    items={[
                        { label: "Teams", href: "#" }, 
                        { label: "Members", href: "#" },
                        { label: "Matches", href: "#"}, 
                        { label: "Teams", href: "#" }, 
                        { label: "Members", href: "#" },
                        { label: "Matches", href: "#"}
                    ]} />
            </div>
        </div>
        <CustomDivider orientation="vertical" flexItem />

        <div className={styles.rightPart}>
        <div
          className={styles.matchWrapper}
          tabIndex={0}
        >
          {/* Current team */}
          <div className={styles.match_left_block}>
            <div className={styles.match_left_block_inner_wrapper}>
              <span className={styles.team_name}>{"Team Name"}</span>
              <Image
                src={teamLogo}
                alt={"Team"}
                className={styles.team_logo}
                width={106}
                height={106}
                unoptimized
              />
            </div>
          </div>

          <div className={styles.matchCenterCol}>
            <LiveDateLabel isLive={true} />
            <div className={styles.scoreWrapper}>
                <div className={`${styles.score} ${chopsic.className}`}>2</div>
                <div className={`${styles.score} ${chopsic.className}`}>:</div>
                <div className={`${styles.score} ${chopsic.className}`}>3</div>
            </div>
            {/* <Image src={vsIcon} alt="vs" className={styles.vsIcon} /> */}
            {/* <span className={styles.matchDate}>
              {formatUTCDate(nextMatch.matchDate, "dd/mm/yyyy")}
            </span> */}
              <Link
                href={`#`}
                className={styles.leagueLink}
                style={{ textDecoration: "none" }}
                onClick={(e) => e.stopPropagation()}
              >
                    <Image
                      src={teamLogo}
                      alt={''}
                      width={18}
                      height={18}
                      unoptimized
                      className={styles.leagueLogo}
                    />
                <span className={styles.league}>
                  League Name
                </span>
              </Link>
          </div>

          {/* Opponent */}
          <div className={styles.match_right_block}>
            <div className={styles.match_right_block_inner_wrapper}>
              <Link
                href={`#`}
                style={{ textDecoration: "none" }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={teamLogo}
                  alt={"Opponent"}
                  className={styles.team_logo}
                  width={106}
                  height={106}
                  unoptimized
                />
              </Link>
              <Link
                href={`#`}
                style={{ textDecoration: "none" }}
                onClick={(e) => e.stopPropagation()}
              >
                <span className={styles.team_name}> {"Team Name"}</span>
              </Link>
            </div>
          </div>
        </div>
        </div>
    </div>
}