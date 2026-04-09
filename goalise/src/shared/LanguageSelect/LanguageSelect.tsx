"use client";

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import styles from "./LanguageSelect.module.css";
import arrowDown from "../../assets/pngs/arrowDown.svg";
import selectedIcon from "../../assets/pngs/selected.svg";
import { setLocale } from "@/app/store/slices/localeSlice";
import { setLocaleCookie, type Locale } from "@/shared/utils/localeCookie";
import type { RootState } from "@/app/store/store";

const languages = [
  { code: "en" as Locale, name: "ENG", fullName: "English" },
  { code: "hy" as Locale, name: "Հայ", fullName: "Հայերեն" },
];

type LanguageSelectVariant = "headerMobile" | "default";

interface LanguageSelectProps {
  variant?: LanguageSelectVariant;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  variant = "default",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const lang = useSelector((state: RootState) => state.locale.locale);

  const toggle = () => setOpen((prev) => !prev);

  const selectLang = (code: Locale) => {
    setLocaleCookie(code);
    dispatch(setLocale(code));
    setOpen(false);
    window.location.reload();
  };

  const selected = languages.find((l) => l.code === lang);

  return (
    variant === 'default' ?
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.select} onClick={toggle}>
        <span className={styles.selectedText}>{selected?.name}</span>

        <Image
          src={arrowDown}
          className={`${styles.arrow} ${open ? styles.arrowOpen : ""}`}
          alt="arrow"
        />
      </div>

      {open && (
        <div className={styles.menu}>
          {languages.map((item) => (
            <div
              key={item.code}
              className={styles.option}
              onClick={() => selectLang(item.code)}
            >
              {lang === item.code && (
                <Image
                  src={selectedIcon}
                  alt="selected"
                  className={styles.checkIcon}
                  width={16}
                  height={16}
                />
              )}
              <span className={styles.optionText}>{item.fullName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
    : <div ref={ref} className={styles.mobileWrapper}>
      <div onClick={toggle} className={styles.mobileSelect}>
        <div>
          <span className={styles.mobileSelectedText}>{selected?.name}</span>
          <Image
            src={arrowDown}
            className={`${styles.mobileArrow} ${open ? styles.mobileArrowOpen : ""}`}
            alt="arrow"
          />
        </div>
        {open && (
        <div className={styles.mobileMenu}>
          {languages.map((item) => (
            <div
              key={item.code}
              className={styles.mobileOption}
              onClick={() => selectLang(item.code)}
            >
              {lang === item.code && (
                <Image
                  src={selectedIcon}
                  alt="selected"
                  width={16}
                  height={16}
                />
              )}
              <span>{item.fullName}</span>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
