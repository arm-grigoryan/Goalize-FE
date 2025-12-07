"use client";
import Link from "next/link";
import styles from "./DropDownSelect.module.css";
export interface DropdownOption {
  value: number;
  label: string;
}

interface DropDownSelectProps {
  options: DropdownOption[];
}

export const DropDownSelect: React.FC<DropDownSelectProps> = ({ options }) => {
  // debug: options

  return (
    <div className={styles.dropdown}>
      {options.map((option) => (
        <Link key={option.value} href={`/leagues/${option.value}`}>
          {option.label}
        </Link>
      ))}
    </div>
  );
};
