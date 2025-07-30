"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "/public/pngs/logo/Logo.png";
import profileImg from "/public/images/headerProfileImg.jpg";
import Link from "next/link";
import Divider from "@/shared/Divider";
import Button from "@/shared/Button";
import iconSearch from "../../../assets/pngs/icon-search.png";

export const Header = () => {
  const buttonClick = () => {
    console.log("clicked");
  };

  return (
    <div className={styles.header}>
      <Image alt="" src={logo} className={styles.logo_wrapper} />
      <div className={styles.hader_menu}>
        <div className={styles.link_wrapper}>
          <Link href="#" className={styles.link}>
            Home
          </Link>
          <Link href="#" className={styles.link}>
            Leagues
          </Link>
          <Link href="#" className={styles.link}>
            Teams
          </Link>
          <Link href="#" className={styles.link}>
            Events
          </Link>
        </div>
        <Button
          className="icon_button"
          handleClick={buttonClick}
          icon={iconSearch}
        />
      </div>
      <div className={styles.leng_and_profile_wrapper}>
        <div className={styles.icon_and_leng_wrapper}>
          <div>icon</div>
          <div>eng</div>
        </div>
        <Divider className="divider_vertical" />
        <div className={styles.name_and_img_wrapper}>
          <div>
            <span>name surname</span>
          </div>
          <div className={styles.profile_img_wrapper}>
            <Image src={profileImg} alt="" className={styles.profile_img} />
          </div>
        </div>
      </div>
    </div>
  );
};
