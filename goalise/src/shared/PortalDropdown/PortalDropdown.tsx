"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DropDownSelect from "@/shared/DropDownSelect";
import { DropdownOption } from "../DropDownSelect/DropDownSelect";

interface PortalDropdownProps {
  options: DropdownOption[];
  targetRef: React.RefObject<HTMLSpanElement | null>;
  onSelect?: (value: number) => void;
  selected?: number;
  onClose?: () => void;
  width?: number;
}

export const PortalDropdown: React.FC<PortalDropdownProps> = ({
  options,
  targetRef,
  onSelect,
  selected,
  onClose,
  width = 200,
}) => {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );

  useEffect(() => {
    if (!targetRef.current) return;
    const rect = targetRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (targetRef.current && !targetRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [targetRef, onClose]);

  if (!coords) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        zIndex: 1000,
        width: width,
      }}
    >
      <DropDownSelect
        options={options}
        selected={selected}
        onSelect={onSelect}
      />
    </div>,
    document.body
  );
};
