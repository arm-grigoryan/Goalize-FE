"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./LanguageSelect.module.css";
import arrowDown from "../../assets/pngs/arrowDown.svg";
import selectedIcon from "../../assets/pngs/selected.svg";
import Image from "next/image";

const languages = [
  { code: "en", name: "ENG", fullName: "English" },
  { code: "hy", name: "Հայ", fullName: "Հայերեն" },
];

type LanguageSelectVariant = "headerMobile" | "default";

interface LanguageSelectProps {
  variant?: LanguageSelectVariant;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  variant = "default",
}) => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => setOpen((prev) => !prev);

  const selectLang = (code: string) => {
    setLang(code);
    setOpen(false);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
