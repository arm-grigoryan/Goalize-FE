"use client";
import Divider from "@/shared/Divider";
import styles from "./HomeUpcaminMatchesCard.module.css";
import Title from "@/shared/Title";
import Button from "@/shared/Button";
import iconSearch from "../../assets/pngs/icon-search.png";

export const HomeUpcaminMatchesCard = () => {
  const buttonClick = () => {
    console.log("clicked");
  };
  return (
    <div className={styles.Home_main_card}>
      <div className={styles.upcoming_mutch}>
        <div className={styles.unpcaming_match_title_wrapper}>
          <Button
            className="icon_button"
            handleClick={buttonClick}
            icon={iconSearch}
          />
          <Title content="Upcaming Matches" />
          <span className={styles.text_span}>
            All the matches which will going to happen in future will display
            here.
          </span>
        </div>
      </div>
      <Divider className="divider_vertical" />
      <div className={styles.match_wrapper}>
        <span className={styles.no_match_text}>
          No match is scheduled at the moment
        </span>
      </div>
    </div>
  );
};
