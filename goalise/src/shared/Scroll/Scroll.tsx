"use client";
import React, { useRef, useEffect, useState } from "react";
import styles from "./Scroll.module.css";
import { ScrollProps } from "./Scroll.types";    

export const Scroll: React.FC<ScrollProps> = ({ children, maxHeight }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [thumbHeight, setThumbHeight] = useState(0);
  const [thumbTop, setThumbTop] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const scrollRatio = wrapper.scrollTop / (wrapper.scrollHeight - wrapper.clientHeight);
      setThumbTop(scrollRatio * (wrapper.clientHeight - thumbHeight));
    };

    const handleResize = () => {
      const ratio = wrapper.clientHeight / wrapper.scrollHeight;
      setThumbHeight(Math.max(ratio * wrapper.clientHeight, 68));
    };

    handleResize();
    wrapper.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      wrapper.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [thumbHeight]);

  return (
    <div className={styles.scrollWrapper} style={{ maxHeight }} ref={wrapperRef}>
      {children}
      <div
        className={styles.scrollThumb}
        style={{ height: thumbHeight, top: thumbTop }}
      />
    </div>
  );
};
