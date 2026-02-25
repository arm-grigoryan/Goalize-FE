import { RefObject, useEffect } from "react";

/**
 * Fires `handler` when the user clicks/taps outside ALL of the supplied refs.
 *
 * Why `pointerdown` instead of `click`:
 *   - Fires before focus changes, so the handler runs before any React state
 *     update triggered by a focus event can interfere.
 *
 * Why `composedPath()`:
 *   - Elements rendered via React Portal live outside the DOM sub-tree of their
 *     logical parent ref.  `Node.contains()` returns false for them.
 *     `composedPath()` returns the full event path including portal nodes, so
 *     the check stays correct even when a dropdown renders its content through
 *     a portal.
 */
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
        // `refs` array identity is stable (created once), so excluding it from deps is safe.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handler, enabled]);
}
