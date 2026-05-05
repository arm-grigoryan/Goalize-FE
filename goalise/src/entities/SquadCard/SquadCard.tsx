'use client'
import React, { useState, useRef, useEffect } from "react";
import styles from './SquadCard.module.css';
import Image from "next/image";
import dots from '../../assets/pngs/dots.svg';
import Link from "next/link";
import profilePictureFallback from '../../assets/pngs/profilePictureIcon.svg';
import ShowMoreCard from "../ShowMoreCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";
import userLogo from '../../assets/pngs/userLogo.svg';

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export interface ISquadCardProps {
  playerName: string;
  shirtNumber: number;
  picture: string | null;
  playerId: number;
  menuType: 'captain' | 'invite' | 'none';
  isOwnCard?: boolean;
  onMakeCaptain?: () => void;
  onRemove?: () => void;
  onEditShirtNumber?: () => void;
  onInvite?: () => void;
  variant?: 'default' | 'events';
  phoneNumber?: string | null;
}

export const SquadCard: React.FC<ISquadCardProps> = ({
  playerName,
  shirtNumber,
  picture,
  playerId,
  menuType,
  isOwnCard,
  onMakeCaptain,
  onRemove,
  onEditShirtNumber,
  onInvite,
  variant = 'default',
  phoneNumber,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;
  useEffect(() => {
    if (!showMenu) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showMenu]);

  const resolvedPicture =
    picture && isValidUrl(picture) ? picture : profilePictureFallback;

  return (
    <Link href={`/profile/${playerId}`} className={`${styles.container} ${isMobile ? styles.mobile : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={styles.wrapper}>
        <div className={`${styles.nameNumberContainer} ${variant === 'events' ? styles.eventsNameContainer : ''}`}>
          <Image
            src={resolvedPicture}
            alt={playerName}
            width={94}
            height={124}
            unoptimized
            className={styles.image}
          />
          {variant === 'default' && (
            <div className={styles.playerNumberContainer}>
              <div className={styles.playerNumber}>{shirtNumber}</div>
            </div>
          )}
        </div>
        {variant === 'events' && isOwnCard && (
          <div className={styles.youButton}>
            <Image src={userLogo} alt="" />
            <div>You</div>
          </div>
        )}
        <span className={`${styles.teamName} ${variant === 'events' ? styles.eventsName : ''}`}>{playerName}</span>
        {variant === 'events' && (
          <div className={`${styles.phoneNumber} ${phoneNumber === null || phoneNumber === undefined ? styles.blurredPhone : ''}`}>
            {phoneNumber ?? '+37400000000'}
          </div>
        )}
        {menuType !== 'none' && variant === 'default' && (
          <div className={styles.menuWrapper} ref={menuRef} onClick={(e) => e.preventDefault()}>
            <Image
              src={dots}
              alt=""
              width={24}
              height={24}
              className={styles.more}
              onClick={(e) => { e.preventDefault(); setShowMenu((prev) => !prev); }}
            />
            {showMenu && variant === 'default' && (
              <div className={styles.menuDropdown}>
                <ShowMoreCard
                  isCaptain={menuType === 'captain'}
                  isOwnCard={isOwnCard}
                  onMakeCaptain={() => { setShowMenu(false); onMakeCaptain?.(); }}
                  onRemove={() => { setShowMenu(false); onRemove?.(); }}
                  onEditShirtNumber={() => { setShowMenu(false); onEditShirtNumber?.(); }}
                  onInvite={() => { setShowMenu(false); onInvite?.(); }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};
