import React from "react";
import styles from './DraftTeamHeader.module.css';
import Image from "next/image";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import Link from "next/link";
import teamLogo from '../../assets/pngs/teamLogo.png';
import edit from '../../assets/pngs/edit.svg';
import Button from "@/shared/Button";
import infoIcon from '../../assets/pngs/infoIcon.svg';

export interface IDraftTeamHeaderProps {
    isLoading?: boolean;
    isCaptain?: boolean;
    isError?: boolean;
}
export const DraftTeamHeader: React.FC<IDraftTeamHeaderProps> = ({
    isCaptain,
    isLoading,
    isError
}) => {
      const { width } = useWindowSize();
      const isMobile = width <= MEDIA_TABLET_SMALL;
    return <div className={`${styles.container} ${isMobile ? styles.mobile : ""}`}>
      <div className={styles.inner}>
        <div className={styles.name_container}>
          {isLoading ? (
            <div
              className={styles.skeleton}
              style={{ width: 130, height: 130, borderRadius: 8 }}
            />
          ) : (
            !isMobile && <Image
              src={teamLogo}
              alt={"Team"}
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
                   {isMobile && <Image
                                    src={teamLogo}
                                    alt={"Team"}
                                    className={styles.teamLogo}
                                    width={130}
                                    height={130}
                                    unoptimized
                                  />}
                  {'Team Name'}
                  {/* {teamInfo?.team.abbreviation && (
                    <span className={styles.abbreviation}>
                      {" "}
                      ({teamInfo.team.abbreviation})
                    </span>
                  )} */}
                </div>
              )}
              {!isMobile && isCaptain && (
                <div
                  className={styles.editButton}
                  onClick={() => {}}
                  style={{ cursor: "pointer" }}
                >
                  <Image src={edit} alt="" />
                </div>
              )}
            </div>

            <div className={styles.buttonsWrapper}>
                <div className={styles.deleteButtonWrapper}> 
                    <Button
                        handleClick={() => {}}
                        content="Delete"
                        className="red_button_transparant_white_text"
                        />
                    {isMobile && isCaptain && (
                        <div
                        className={styles.editButton}
                        onClick={() => {}}
                        style={{ cursor: "pointer" }}
                        >
                        <Image src={edit} alt="" />
                        </div>
                    )}
                    <div className={styles.button}>
                        <div> Last Edited: </div>
                        <span>
                            29.03.26
                            <div> 12: 30</div>
                        </span>
                    </div>
              </div>
                <div className={styles.rejectedWrapper}> 
                    <div className={styles.rejectedInner}> 
                        <div className={styles.status}> Status: </div>
                        <div className={styles.abandoned}>
                            <Image src={infoIcon} alt=""/>
                            <div className={styles.abandonedText}>Rejected
                            </div>
                         </div>
                      {!isMobile && <div className={styles.button}>
                          <div> Reviewed: </div>
                          <span> 
                            14.08.26
                            <div className={styles.clock}>12:56</div>
                            </span>
                        </div>}
                    </div>
                    <div className={styles.rejectedText}>The text here why is rejected.</div>
                    {isMobile && <div className={styles.button}>
                          <div> Reviewed: </div>
                          <span> 
                            14.08.26
                            <div className={styles.clock}>12:56</div>
                            </span>
                        </div>}
                </div>
            </div>
          </div>
        </div>

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
        {!isLoading  && (
          <div className={styles.infoImageWrapper}>
            <div className={styles.nameButtonWrapper}>
              <Link
                href={`#`}
                style={{ textDecoration: "none" }}
              >
                <div className={styles.playerName}>{'Poghos Poghosyan'}
                {!isCaptain &&
                  <div className={styles.captainLabel}> (C) </div>}
                </div>
              </Link>
              <div className={styles.infoButtonsWrapper}>
                
                  <div className={styles.button}>
                    <span>Age: </span>
                    {'24'}
                  </div>
                  <div className={styles.button}>
                    <span>Foot: </span>
                    {'Right'}
                  </div>
              </div>
            </div>

            <Link
              href={`#`}
              style={{ textDecoration: "none" }}
              className={styles.playerImageWrapper}
            >
              <Image
                src={teamLogo}
                alt={''}
                className={styles.playerImage}
                width={173}
                height={221}
                unoptimized
              />
            </Link>
          </div>
        )}
      </div>
    </div>
}