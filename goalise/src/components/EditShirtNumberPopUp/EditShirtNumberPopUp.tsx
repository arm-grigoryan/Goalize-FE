'use client'
import React, { useState } from "react";
import styles from './EditShirtNumberPopUp.module.css';
import Image from "next/image";
import redArrowRight from '../../assets/pngs/redArrowRight.svg';
import shirt from '../../assets/pngs/shirt.svg';
import Button from "@/shared/Button";
import arrowRightIcon from '../../assets/pngs/arrowRightIcon.png';
import { ISquadPlayer } from "@/types/api/squad";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import { useTranslations } from "next-intl";

export interface IEditShirtNumberPopUpProps {
  player: ISquadPlayer;
  squad: ISquadPlayer[];
  onClose: () => void;
  onSubmit: (newShirtNumber: number) => void;
  isLoading?: boolean;
}

export const EditShirtNumberPopUp: React.FC<IEditShirtNumberPopUpProps> = ({
  player,
  squad,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  const t = useTranslations("editShirtNumber");
  const tCommon = useTranslations("common");
  const [value, setValue] = useState('');

  const parsed = parseInt(value, 10);
  const isOutOfRange = value !== '' && !isNaN(parsed) && (parsed < 1 || parsed > 26);
  const isSameAsCurrent = value !== '' && !isNaN(parsed) && parsed === player.shirtNumber;
  const isValid = value !== '' && !isNaN(parsed) && parsed >= 1 && parsed <= 26 && !isSameAsCurrent;

  const conflictPlayer = isValid
    ? squad.find((p) => p.shirtNumber === parsed && p.playerId !== player.playerId)
    : null;

  const message = isOutOfRange
    ? t("outOfRange")
    : isSameAsCurrent
    ? t("sameAsCurrent")
    : isValid
    ? conflictPlayer
      ? t("willBeSwitched", {
          firstName1: player.firstName,
          lastName1: player.lastName,
          firstName2: conflictPlayer.firstName,
          lastName2: conflictPlayer.lastName,
        })
      : t("numberIsFree")
    : '';

  const handleSubmit = () => {
    if (!isValid || isLoading) return;
    onSubmit(parsed);
  };

  return (
    <div className={`${styles.overlay} ${isMobile ? styles.mobile : ''}`} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} type="button" aria-label={tCommon("close")}>×</button>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>{t("title")}</div>
          <div className={styles.subTitle}>{t("subtitle")}</div>
        </div>

        <div className={styles.inputsContainer}>
          <div className={styles.editText}>{t("editLabel")}</div>
          <div className={styles.inputsWrapper}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={player.shirtNumber}
                readOnly
                className={styles.readOnly}
              />
              <label>{t("current")}</label>
            </div>
            <div> <Image src={redArrowRight} alt="" /></div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={value}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  setValue(v);
                }}
                placeholder=" "
              />
              <label>{t("new")}</label>
            </div>
          </div>
        </div>

        {message && (
          <div className={styles.describtionWrapper}>
            <div className={`${styles.iconWrapper} ${styles.blueGlow}`}>
              <Image src={shirt} alt="" className={styles.icon} />
            </div>
            <div className={`${styles.describtion} ${isOutOfRange || isSameAsCurrent || conflictPlayer ? styles.warning : styles.success}`}>
              {message}
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <Button
            className={isValid && !isLoading ? "gray_buttonIcon_active" : "gray_buttonIcon"}
            handleClick={handleSubmit}
            content={tCommon("save")}
            icon={arrowRightIcon}
            disabled={!isValid || isLoading}
          />
          <Button
            className="red_button_transparant_white_text"
            handleClick={onClose}
            content={tCommon("cancel")}
          />
        </div>
      </div>
    </div>
  );
};
