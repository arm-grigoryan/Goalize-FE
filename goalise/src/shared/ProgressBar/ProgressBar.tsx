import React, { useState } from "react";
import { useTranslations } from "next-intl";
import styles from "./ProgressBar.module.css";
import { useWindowSize } from "@/hooks/useWindowSize";
import { MEDIA_TABLET_SMALL } from "@/constants/windowSizes";

interface ProgressBarProps {
  wins: number;
  draws: number;
  losses: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ wins, draws, losses }) => {
  const { width } = useWindowSize();
  const t = useTranslations("progressBar");
  const isMobile = width <= MEDIA_TABLET_SMALL;

  const sections = [
    { key: "win", label: t("win"), value: wins, color: "#4d7cffb6" },
    { key: "loss", label: t("loss"), value: losses, color: "#ff4d4dc3" },
    { key: "draw", label: t("draw"), value: draws, color: "#b0b0b0b0" },
  ];

  const total = sections.reduce((acc, item) => acc + item.value, 0);

  const [hovered, setHovered] = useState<number | null>(null);
  const [showEmptyTooltip, setShowEmptyTooltip] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    setCursorPos({ x: localX, y: localY });

    if (total === 0) return;

    const cx = localX - rect.width / 2;
    const cy = localY - rect.height / 2;

    let angle = Math.atan2(cy, cx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    let acc = 0;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].value === 0) continue;
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
  const gap = total > 0 ? 2 : 0;

  const gradient =
    total === 0
      ? "#333333"
      : sections
          .map((item) => {
            const start = (current / total) * 100;
            current += item.value;
            const end = (current / total) * 100;

            if (item.value === 0) return null;

            const safeStart = start + gap / 2;
            const safeEnd = end - gap / 2;

            return `
              transparent ${start}% ${safeStart}%,
              ${item.color} ${safeStart}% ${safeEnd}%,
              transparent ${safeEnd}% ${end}%
            `;
          })
          .filter(Boolean)
          .join(",");

  const getTooltipText = (index: number) => {
    const s = sections[index];
    const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
    return `${s.label} - ${s.value} (${pct}%)`;
  };

  if (isMobile) {
    return (
      <div className={styles.mobileContainer}>
        <div className={styles.lineWrapper}>
          {total === 0 ? (
            <div className={styles.lineSegment} style={{ width: "100%", background: "#333333" }} />
          ) : (
            sections.map((item) => {
              if (item.value === 0) return null;
              const widthPercent = (item.value / total) * 100;
              return (
                <div
                  key={item.key}
                  className={styles.lineSegment}
                  style={{ width: `${widthPercent}%`, background: item.color }}
                />
              );
            })
          )}
        </div>

        <div className={styles.labels}>
          {sections.map((item) => {
            const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div key={item.key} className={styles.labelItem}>
                <span className={styles.dot} style={{ background: item.color }} />
                {item.label} - {item.value} ({percent}%)
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
        style={{ background: total > 0 ? `conic-gradient(${gradient})` : "#333333" }}
        onMouseMove={handleMove}
        onMouseEnter={() => { if (total === 0) setShowEmptyTooltip(true); }}
        onMouseLeave={() => { setHovered(null); setShowEmptyTooltip(false); setCursorPos(null); }}
      >
        <div className={styles.innerCircle}>
          <div className={styles.winRateText}>{t("teamWinRate")}</div>
        </div>

        {total === 0 && showEmptyTooltip && cursorPos && (
          <div className={styles.tooltip} style={{ left: cursorPos.x, top: cursorPos.y - 30 }}>
            No games yet
          </div>
        )}

        {hovered !== null && cursorPos && (
          <div className={styles.tooltip} style={{ left: cursorPos.x, top: cursorPos.y - 30 }}>
            {getTooltipText(hovered)}
          </div>
        )}
      </div>
    </div>
  );
};
