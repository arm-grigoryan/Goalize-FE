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
  // debug: options

  return (
    <div className={styles.dropdown}>
      <div className={styles.linksWrapper}> 
      {options.map((option) => (
        <>
        {option.image &&  <Image src={option.image} alt=""/>}
          <Link key={option.value} href={`/leagues/${option.value}`} className={styles.links}>
            {option.label}
          </Link>
          </>
        ))}
        </div>
    </div>
  );
};
