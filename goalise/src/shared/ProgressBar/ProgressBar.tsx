import React, { useState } from "react";
import styles from "./ProgressBar.module.css";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

export const ProgressBar: React.FC = () => {
  const { width } = useWindowSize();
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const sections = [
    { label: "Wins", value: 35, color: "#4d7cffb6" },
    { label: "Losses", value: 13, color: "#ff4d4dc3" },
    { label: "Draws", value: 34, color: "#b0b0b0b0" },
  ];

  const total = sections.reduce((acc, item) => acc + item.value, 0);

  const [hovered, setHovered] = useState<number | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    let acc = 0;
    for (let i = 0; i < sections.length; i++) {
      const start = (acc / total) * 360;
      acc += sections[i].value;
      const end = (acc / total) * 360;

      if (angle >= start && angle <= end) {
        setHovered(i);
        return;
      }
    }

    setHovered(null);
  };

  let current = 0;
  const gap = 2;

  const gradient = sections
    .map((item) => {
      const start = (current / total) * 100;
      current += item.value;
      const end = (current / total) * 100;

      const safeStart = start + gap / 2;
      const safeEnd = end - gap / 2;

      return `
        transparent ${start}% ${safeStart}%,
        ${item.color} ${safeStart}% ${safeEnd}%,
        transparent ${safeEnd}% ${end}%
      `;
    })
    .join(",");

  let tooltipStyle: React.CSSProperties | undefined;

  if (hovered !== null) {
    let acc = 0;

    for (let i = 0; i <= hovered; i++) {
      const start = (acc / total) * 360;
      acc += sections[i].value;
      const end = (acc / total) * 360;

      if (i === hovered) {
        const midAngle = (start + end) / 2;

        const rad = (midAngle - 90) * (Math.PI / 180);

        const radiusOffset = 110;

        const x = Math.cos(rad) * radiusOffset;
        const y = Math.sin(rad) * radiusOffset;

        tooltipStyle = {
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
        };
      }
    }
  }

  if (isMobile) {
    return (
      <div className={styles.mobileContainer}>
        <div className={styles.lineWrapper}>
          {sections.map((item) => {
            const widthPercent = (item.value / total) * 100;

            return (
              <div
                key={item.label}
                className={styles.lineSegment}
                style={{
                  width: `${widthPercent}%`,
                  background: item.color,
                }}
              />
            );
          })}
        </div>

        <div className={styles.labels}>
          {sections.map((item) => {
            const percent = ((item.value / total) * 100).toFixed(0);

            return (
              <div key={item.label} className={styles.labelItem}>
                <span
                  className={styles.dot}
                  style={{ background: item.color }}
                />
                {item.label} {percent}%
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.chart}
        style={{
          background: `conic-gradient(${gradient})`,
        }}
        onMouseMove={handleMove}
        onMouseLeave={() => setHovered(null)}
      >
        <div className={styles.innerCircle}>
          <div className={styles.winRateText}>Team Win Rate</div>
        </div>

        {hovered !== null && tooltipStyle && (
          <div className={styles.tooltip} style={tooltipStyle}>
            {sections[hovered].label}{" "}
            {((sections[hovered].value / total) * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </div>
  );
};