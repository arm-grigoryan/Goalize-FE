"use client";
import styles from "./Header.module.css";
import Image from "next/image";
import logo from "/public/pngs/logo/Logo.png";
import Link from "next/link";

export const Header = () => {
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
        <div>search</div>
      </div>

      <div>
        <span>leng</span>
        <div>
          <span>name surname</span>
          <div>image</div>
        </div>
      </div>
    </div>
  );
};
