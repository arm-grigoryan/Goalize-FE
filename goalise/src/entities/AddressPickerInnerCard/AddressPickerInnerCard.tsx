import Image from "next/image";
import React from "react";
import addressGray from '../../assets/pngs/addressGray.svg';
import styles from './AddressPickerInnerCard.module.css';
import addressRedIcon from '../../assets/pngs/addressRedIcon.svg';

export interface IAddressPickerInnerCardProps {
    isSelected?: boolean;
    address?: string;
}
export const AddressPickerInnerCard: React.FC<IAddressPickerInnerCardProps> = ({
    isSelected,
    address
}) => {
    return <div className={styles.container}>
            <Image src={isSelected ? addressRedIcon : addressGray} alt="" />
            <div className={`${styles.address} ${isSelected && styles.selected}`}>{address}</div>
    </div>
}