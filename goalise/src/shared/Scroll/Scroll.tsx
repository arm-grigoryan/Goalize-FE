"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./Scroll.module.css";
import { ScrollProps } from "./Scroll.types";

export const Scroll: React.FC<ScrollProps> = ({ children, maxHeight }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const thumbHeightRef = useRef(0);
  const [thumbTop, setThumbTop] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const scrollableHeight = wrapper.scrollHeight - wrapper.clientHeight;
      if (scrollableHeight <= 0) return;

      const scrollRatio = wrapper.scrollTop / scrollableHeight;
      const maxThumbTop = wrapper.clientHeight - thumbHeightRef.current;
      setThumbTop(scrollRatio * maxThumbTop);
    };

    const handleResize = () => {
      const ratio = wrapper.clientHeight / wrapper.scrollHeight;
      thumbHeightRef.current = Math.max(ratio * wrapper.clientHeight, 68);
      handleScroll();
    };

    handleResize();
    wrapper.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      wrapper.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className={styles.scrollWrapper}
      style={{ maxHeight }}
      ref={wrapperRef}
    >
      {children}
      <div
        className={styles.scrollThumb}
        style={{ height: thumbHeightRef.current, top: thumbTop }}
      />
    </div>
  );
};
