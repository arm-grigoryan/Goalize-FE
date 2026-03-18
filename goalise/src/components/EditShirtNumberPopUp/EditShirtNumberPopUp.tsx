'use client'
import React, { useState } from "react";
import styles from './EditShirtNumberPopUp.module.css';
import Image from "next/image";
import redArrowRight from '../../assets/pngs/redArrowRight.svg';
import shirt from '../../assets/pngs/shirt.svg';
import Button from "@/shared/Button";
import arrowRightIcon from '../../assets/pngs/arrowRightIcon.png';
import { ISquadPlayer } from "@/types/api/squad";

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
  const [value, setValue] = useState('');

  const parsed = parseInt(value, 10);
  const isOutOfRange = value !== '' && !isNaN(parsed) && (parsed < 1 || parsed > 26);
  const isValid = value !== '' && !isNaN(parsed) && parsed >= 1 && parsed <= 26;

  const conflictPlayer = isValid
    ? squad.find((p) => p.shirtNumber === parsed && p.playerId !== player.playerId)
    : null;

  const message = isOutOfRange
    ? 'Shirt number must be between 1 and 26'
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
    <div className={styles.overlay} onClick={onClose}>
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
            </div>
            <Image src={redArrowRight} alt="" />
            <div className={styles.inputWrapper}>
              <input
                type="number"
                min={1}
                max={26}
                value={value}
                onChange={(e) => setValue(e.target.value)}
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
            <div className={`${styles.describtion} ${isOutOfRange || conflictPlayer ? styles.warning : styles.success}`}>
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
