import { useCallback, useId, useMemo, useRef, type CSSProperties, type Ref } from "react";
import { setRef } from "./compose.js";

// Shared by every Component that opens a popup next to a trigger: Tooltip, and the Select list.
// The popup is a manual popover, so it renders in the browser's top layer without a portal, and
// CSS anchor positioning places it. There is no JavaScript collision engine (ADR 0004).

export type PopoverSide = "top" | "right" | "bottom" | "left";

const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;

/** The popup's margin that faces the anchor. A position-try flip mirrors it with the side. */
const facingMargin = {
  top: "marginBottom",
  bottom: "marginTop",
  left: "marginRight",
  right: "marginLeft",
} as const;

/** The side the popup actually landed on, read from where it sits against the anchor. */
function measureSide(popup: HTMLElement, anchor: HTMLElement | null, side: PopoverSide) {
  if (!anchor) return side;
  const box = popup.getBoundingClientRect();
  const target = anchor.getBoundingClientRect();
  // A pixel of slack absorbs subpixel rounding.
  const beyond = {
    top: box.bottom <= target.top + 1,
    bottom: box.top >= target.bottom - 1,
    left: box.right <= target.left + 1,
    right: box.left >= target.right - 1,
  };
  return !beyond[side] && beyond[opposite[side]] ? opposite[side] : side;
}

export interface AnchoredPopoverOptions<P extends HTMLElement> {
  /** Side of the anchor the popup opens on. It flips to the opposite side when there is no room. */
  side: PopoverSide;
  /** Gap in pixels between the anchor and the popup. */
  offset: number;
  /** Another ref to the popup element, such as the Component's forwarded ref. */
  ref?: Ref<P>;
  /**
   * Keeps the popup mounted and shows it only while this is true. Left out, the popup shows
   * whenever it is mounted.
   */
  open?: boolean;
}

/**
 * Anchors a popup to a trigger. Spread `anchorStyle` and pass `anchorRef` to the trigger, and
 * spread `popoverProps` onto the popup. Either render the popup only while it is open, so its ref
 * shows it as a manual popover on mount and unmounting it hides it, or pass `open` to keep it
 * mounted and show it only while that is true. While it shows, `data-side` on it holds the side it
 * landed on after any flip.
 *
 * The component's CSS resets the UA popover box inside `@supports (position-area: top)`, with
 * `inset: auto` and `margin: 0`, so the offset margin here is the only one. Without anchor
 * positioning the popup keeps the UA styles and opens in the centre of the viewport.
 */
export function useAnchoredPopover<A extends HTMLElement, P extends HTMLElement>({
  side,
  offset,
  ref,
  open = true,
}: AnchoredPopoverOptions<P>) {
  // useId's characters are not all valid in a dashed ident, so only the safe ones are kept.
  const anchorName = `--kui-anchor-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const anchorRef = useRef<A | null>(null);
  const stopTracking = useRef<(() => void) | null>(null);

  const popoverRef = useCallback(
    (popup: P | null) => {
      stopTracking.current?.();
      stopTracking.current = null;
      // The callback changes with `open`, so React calls it again whenever the popup opens or closes.
      if (popup && !open) {
        if (popup.matches(":popover-open")) popup.hidePopover();
        delete popup.dataset.side;
      } else if (popup) {
        if (!popup.matches(":popover-open")) popup.showPopover();
        const update = () => {
          popup.dataset.side = measureSide(popup, anchorRef.current, side);
        };
        update();
        // Anchor positioning may flip the popup again when the page scrolls or the window resizes.
        const options = { capture: true, passive: true };
        window.addEventListener("scroll", update, options);
        window.addEventListener("resize", update, options);
        stopTracking.current = () => {
          window.removeEventListener("scroll", update, options);
          window.removeEventListener("resize", update, options);
        };
      }
      setRef(ref, popup);
    },
    [side, ref, open],
  );

  const anchorStyle = useMemo<CSSProperties>(() => ({ anchorName }), [anchorName]);

  const popoverStyle = useMemo<CSSProperties>(
    () => ({
      positionAnchor: anchorName,
      positionArea: side,
      positionTryFallbacks: side === "top" || side === "bottom" ? "flip-block" : "flip-inline",
      [facingMargin[side]]: offset,
    }),
    [anchorName, side, offset],
  );

  return {
    anchorRef,
    anchorStyle,
    popoverProps: { ref: popoverRef, popover: "manual" as const, style: popoverStyle },
  };
}
