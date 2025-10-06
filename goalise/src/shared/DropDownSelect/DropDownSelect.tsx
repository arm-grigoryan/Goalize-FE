import styles from "./DropdownSelect.module.css";

export interface DropdownOption {
  value: number;
  label: string;
}

interface DropDownSelectProps {
  options: DropdownOption[];
  selected?: number;
  onSelect?: (value: number) => void;
}

export const DropDownSelect: React.FC<DropDownSelectProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <div className={styles.dropdown}>
      {options.map((option) => (
        <div
          key={option.value}
          className={`${styles.option} ${
            option.value === selected ? styles.selectedOption : ""
          }`}
          onClick={() => onSelect?.(option.value)}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};
