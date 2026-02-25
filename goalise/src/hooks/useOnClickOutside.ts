import { RefObject, useEffect } from "react";

export function useOnClickOutside(
  refs: RefObject<HTMLElement | null>[],
  handler: (event: PointerEvent) => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    function onPointerDown(e: PointerEvent) {
      const path = e.composedPath();
      const isInside = refs.some(
        (ref) => ref.current && path.includes(ref.current),
      );
      if (!isInside) handler(e);
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [handler, enabled]);
}
