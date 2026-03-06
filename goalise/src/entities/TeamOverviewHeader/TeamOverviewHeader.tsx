"use client";

import Link from "next/link";
import React from "react";
import styles from './TeamOverviewHeader.module.css';
import Image from "next/image";
import Button from "@/shared/Button";
import teamLogo from '.././../assets/pngs/teamLogo.png';
import edit from '../../assets/pngs/edit.svg';
import toBeDeteled from '../../assets/pngs/toBeDeleted.png';
import { useParams, usePathname } from "next/navigation";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useWindowSize } from "@/hooks/useWindowSize";

export const TeamOverviewHeader: React.FC = () => {
  const {width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const { teamId } = useParams();
  const pathname = usePathname();
  const base = `/teams/${teamId}`;

  const isActive = (href: string) => {
    if (href === base) {
      return pathname === base;
    }
    return pathname.startsWith(href);
  };

  return <div className={`${styles.container} ${isMobile ? styles.mobile : ''}`}>
      <div className={styles.inner}>
          <div className={styles.name_container}>
          <Image src={teamLogo} alt="champions league" className={styles.teamLogo}/>
          <div className={styles.name_and_button}>
              <div className={styles.nameWrapper}>
                 <div className={styles.name}> {'name'}</div>
                  {!isMobile && <div className={styles.editButton}>
                      <Image src={edit} alt="" />
                  </div>}
              </div>
              <div className={styles.buttonsWrapper}> 
                <Button
                  handleClick={()=> {}}
                  content="Apply"
                  className="red_button_transparant_white_text"
                  />
                  { isMobile && <div className={styles.editButton}>
                      <Image src={edit} alt="" />
                  </div>}
                </div>
          </div>
      </div>
      <div className={styles.infoImageWrapper}>
          <div className={styles.nameButtonWrapper}>
              <div className={styles.playerName}> Vruyr Saghatelyan</div>
              <div className={styles.buttonsWrapper}>
                  <div className={styles.button}>
                      <span>Age: </span>
                      23
                  </div>
                  <div className={styles.button}>
                      <span>Foot: </span>
                      Right
                  </div>
                  <div className={styles.button}>
                      <span> Rank: </span>
                      Captain
                  </div>
              </div>
          </div>
          <Image src={toBeDeteled} alt="" className={styles.playerImage}/>
      </div>
      </div>
      <div className={styles.links}>
        <Link
          href={base}
          className={`${styles.link} ${isActive(base) ? styles.selected : ''}`}
        >
          Overview
        </Link>
        <Link
          href={`${base}/results`}
          className={`${styles.link} ${isActive(`${base}/results`) ? styles.selected : ''}`}
        >
          Results
        </Link>
        <Link
          href={`${base}/fixtures`}
          className={`${styles.link} ${isActive(`${base}/fixtures`) ? styles.selected : ''}`}
        >
          Fixtures
        </Link>
        <Link
          href={`${base}/transfers`}
          className={`${styles.link} ${isActive(`${base}/transfers`) ? styles.selected : ''}`}
        >
          Transfers
        </Link>
        <Link
          href={`${base}/squad`}
          className={`${styles.link} ${isActive(`${base}/squad`) ? styles.selected : ''}`}
        >
          Squad
        </Link>
      </div>
  </div>
}
