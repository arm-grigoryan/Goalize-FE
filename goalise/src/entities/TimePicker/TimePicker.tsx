import React, { useEffect, useRef, useState } from "react";
import styles from "./TimePicker.module.css";

const repeat = <T,>(arr: T[]) => [...arr, ...arr, ...arr];

export interface ITimePickerProps {
  onChange?: (hour: number, minute: number, period?: string) => void;
}

export const TimePicker: React.FC<ITimePickerProps> = ({ onChange }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const period = ["AM", "PM"];

  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  const ITEM_HEIGHT = 40;

  const [selectedHour, setSelectedHour] = useState(0);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("AM");

  useEffect(() => {
    onChange?.(selectedHour, selectedMinute, selectedPeriod);
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const centerScroll = (el: HTMLDivElement | null, baseLength: number) => {
    if (!el) return;
    el.scrollTop = baseLength * ITEM_HEIGHT;
  };

  useEffect(() => {
    centerScroll(hoursRef.current, hours.length);
    centerScroll(minutesRef.current, minutes.length);
    centerScroll(periodRef.current, period.length);
  }, []);

  const handleInfiniteScroll = (
    e: React.UIEvent<HTMLDivElement>,
    baseLength: number,
    setValue: (v: any) => void,
    values: any[]
  ) => {
    const el = e.currentTarget;

    const index = Math.round(el.scrollTop / ITEM_HEIGHT) % values.length;
    setValue(values[index]);

    const max = baseLength * ITEM_HEIGHT * 2;

    if (el.scrollTop <= 0) {
      el.scrollTop = baseLength * ITEM_HEIGHT;
    }

    if (el.scrollTop >= max) {
      el.scrollTop = baseLength * ITEM_HEIGHT;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.picker}>
        <div className={styles.column}>
          <div
            className={styles.scroll}
            ref={hoursRef}
            onScroll={(e) =>
              handleInfiniteScroll(e, hours.length, setSelectedHour, hours)
            }
          >
            {repeat(hours).map((h, i) => (
              <time key={i} className={styles.item}>
                {h}
              </time>
            ))}
          </div>

          <div className={styles.circle}>{selectedHour}</div>
        </div>

        <div className={styles.column}>
          <div
            className={styles.scroll}
            ref={minutesRef}
            onScroll={(e) =>
              handleInfiniteScroll(e, minutes.length, setSelectedMinute, minutes)
            }
          >
            {repeat(minutes).map((m, i) => (
              <time key={i} className={styles.item}>
                {m.toString().padStart(2, "0")}
              </time>
            ))}
          </div>

          <div className={styles.circle}>
            {selectedMinute.toString().padStart(2, "0")}
          </div>
        </div>

        <div className={styles.column}>
          <div
            className={styles.scroll}
            ref={periodRef}
            onScroll={(e)=> handleInfiniteScroll(e, period.length,setSelectedPeriod, period)}
          >
            {repeat(period).map((p, i) => (
              <time key={i} className={styles.item}>
                {p}
              </time>
            ))}
          </div>

          <div className={styles.circle}>{selectedPeriod}</div>
        </div>
      </div>
    </div>
  );
};