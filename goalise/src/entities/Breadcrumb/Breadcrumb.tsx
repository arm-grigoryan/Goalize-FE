"use client";

import Link from "next/link";
import Image from "next/image";
import chevronRight from "../../assets/pngs/chevronRight.svg";
import styles from './Breadcromb.module.css';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className = { styles.container}>
      {items.map((item, index) => (
        <span
          key={index}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          {index !== 0 && <Image src={chevronRight} alt=">" width={12} height={12} />}
          {item.href && 
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
            }
        </span>
      ))}
    </nav>
  );
}