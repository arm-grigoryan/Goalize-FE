"use client";
import Link from "next/link";
import styles from "./DropDownSelect.module.css";
import Image from "next/image";
export interface DropdownOption {
  value: number;
  label: string;
  image?: string;
}

interface DropDownSelectProps {
  options: DropdownOption[];
}

export const DropDownSelect: React.FC<DropDownSelectProps> = ({ options }) => {

  return (
    <div className={styles.dropdown}>
      <div className={styles.linksWrapper}>
        {options.map((option) => (
          <Link key={option.value} href={`/leagues/${option.value}`} className={styles.links}>
            {option.image && <Image src={option.image} alt="" />}
            <span>{option.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};
