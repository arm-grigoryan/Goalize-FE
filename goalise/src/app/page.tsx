"use client";
import { useState } from "react";
import styles from "./page.module.css";
import Button from "./shared/Button";

export default function Home() {
  const [test, setTest] = useState(false);
  return (
    <div className={styles.page}>
      <Button
        content="join league"
        className="join_league_button"
        isActive={test}
        handleClick={() => setTest(!test)}
      />
    </div>
  );
}
