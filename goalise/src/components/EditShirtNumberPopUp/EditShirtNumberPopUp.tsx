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
  const [value, setValue] = useState('');

  const parsed = parseInt(value, 10);
  const isOutOfRange = value !== '' && !isNaN(parsed) && (parsed < 1 || parsed > 26);
  const isSameAsCurrent = value !== '' && !isNaN(parsed) && parsed === player.shirtNumber;
  const isValid = value !== '' && !isNaN(parsed) && parsed >= 1 && parsed <= 26 && !isSameAsCurrent;

  const conflictPlayer = isValid
    ? squad.find((p) => p.shirtNumber === parsed && p.playerId !== player.playerId)
    : null;

  const message = isOutOfRange
    ? 'Shirt number must be between 1 and 26'
    : isSameAsCurrent
    ? 'Please use a different number than Current'
    : isValid
    ? conflictPlayer
      ? `${player.firstName} ${player.lastName} and ${conflictPlayer.firstName} ${conflictPlayer.lastName} will be switched`
      : 'Chosen shirt number is free'
    : '';

  const handleSubmit = () => {
    if (!isValid || isLoading) return;
    onSubmit(parsed);
  };

  return (
    <div className={`${styles.overlay} ${isMobile ? styles.mobile : ''}`} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>Edit Shirt Number</div>
          <div className={styles.subTitle}>Your winning journey starts here!</div>
        </div>

        <div className={styles.inputsContainer}>
          <div className={styles.editText}>Edit Shirt Number</div>
          <div className={styles.inputsWrapper}>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                value={player.shirtNumber}
                readOnly
                className={styles.readOnly}
              />
              <label>Current</label>
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
              <label>New</label>
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
            className="gray_buttonIcon"
            handleClick={handleSubmit}
            content="Save"
            icon={arrowRightIcon}
            disabled={!isValid || isLoading}
          />
          <Button
            className="red_button_transparant_white_text"
            handleClick={onClose}
            content="Cancel"
          />
        </div>
      </div>
    </div>
  );
};
