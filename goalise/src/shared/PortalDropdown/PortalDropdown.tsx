"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DropDownSelect from "@/shared/DropDownSelect";
import { DropdownOption } from "../DropDownSelect/DropDownSelect";

interface PortalDropdownProps {
  options: DropdownOption[];
  targetRef: React.RefObject<HTMLSpanElement | null>;
  onClose?: () => void;
}

export const PortalDropdown: React.FC<PortalDropdownProps> = ({
  options,
  targetRef,
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
  }, [targetRef]);

  if (!coords) return null;

  return createPortal(
    <div
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        top: coords.top,
        left: coords.left,
        zIndex: 1000,
      }}
    >
      <DropDownSelect options={options} />
    </div>,
    document.body
  );
};
