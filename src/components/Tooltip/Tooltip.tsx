"use client";

import {
  Children,
  cloneElement,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { composeEventHandlers, composeRefs, getElementRef } from "../../compose.js";
import { useControllableState } from "../../controllable-state.js";
import { useAnchoredPopover } from "../../popover.js";

export type TooltipSide = "top" | "right" | "bottom" | "left";

/** Gap between the trigger and the box. */
const SIDE_OFFSET = 6;
/** Milliseconds the pointer has to cross from the trigger onto the box before it closes. */
const CLOSE_GRACE = 100;
/** Opening one tooltip closes any other, so two never show at once. */
const TOOLTIP_OPEN = "kui-tooltip-open";

/**
 * The child is the trigger and receives the hover, focus, and aria wiring. `className`, the ref,
 * and every other prop go to the tooltip box, which exists only while the tooltip is open.
 */
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content" | "children"> {
  /** What the tooltip says. Announced as the trigger's description, so keep it to plain text. */
  content: ReactNode;
  /** Side of the trigger the box opens on. It flips to the other side when there is no room. */
  side?: TooltipSide;
  /** Milliseconds the pointer rests on the trigger before it opens. Focus opens it at once. */
  delay?: number;
  /** Controlled open state. Pair it with onOpenChange. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called with the next open state when hover, focus, blur, or Escape changes it. */
  onOpenChange?: (open: boolean) => void;
  /** The trigger: one focusable element such as a Button. It must forward its ref. */
  children: ReactElement;
}

type TriggerProps = HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };

/**
 * A short description of its trigger. It opens on hover and keyboard focus, closes on Escape and
 * blur, and screen readers read it as the trigger's description.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  {
    content,
    side = "top",
    delay = 700,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    className,
    style,
    id: idProp,
    onPointerEnter,
    onPointerLeave,
    children,
    ...props
  },
  ref,
) {
  const [open, setOpenState] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const state = open ? "open" : "closed";
  const generatedId = useId();
  const id = idProp ?? generatedId;

  // Event handlers and timers read the latest open state here, so onOpenChange fires only on a
  // real change even when a timer was set before a focus or Escape changed it.
  const openRef = useRef(open);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // The pointer has rested on the trigger since it last entered, so moving it opens nothing more.
  const hovering = useRef(false);
  // A press on the trigger focuses it, and that focus must not open the tooltip.
  const pressing = useRef(false);

  useEffect(() => {
    openRef.current = open;
  });

  const clearTimers = () => {
    clearTimeout(openTimer.current);
    clearTimeout(closeTimer.current);
  };

  const setOpen = (next: boolean) => {
    clearTimers();
    if (openRef.current === next) return;
    openRef.current = next;
    if (next) document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
    setOpenState(next);
  };

  const closeAfterGrace = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_GRACE);
  };

  // Rendered effects hold the latest setOpen in a ref so their listeners stay the same function.
  const setOpenRef = useRef(setOpen);
  useEffect(() => {
    setOpenRef.current = setOpen;
  });

  useEffect(() => {
    if (!open) return;
    const close = () => setOpenRef.current(false);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener(TOOLTIP_OPEN, close);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener(TOOLTIP_OPEN, close);
    };
  }, [open]);

  useEffect(() => () => clearTimers(), []);

  const { anchorRef, anchorStyle, popoverProps } = useAnchoredPopover<HTMLElement, HTMLDivElement>({
    side,
    offset: SIDE_OFFSET,
    ref,
  });

  const child = Children.only(children) as ReactElement<TriggerProps>;
  const childRef = getElementRef<HTMLElement>(child);
  const triggerRef = useMemo(() => composeRefs(childRef, anchorRef), [childRef, anchorRef]);
  const describedBy = [child.props["aria-describedby"], open ? id : undefined]
    .filter(Boolean)
    .join(" ");

  const trigger = cloneElement(child, {
    ref: triggerRef,
    style: { ...child.props.style, ...anchorStyle },
    "data-state": state,
    "aria-describedby": describedBy || undefined,
    onPointerMove: composeEventHandlers(
      child.props.onPointerMove,
      (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === "touch" || hovering.current) return;
        hovering.current = true;
        clearTimeout(closeTimer.current);
        if (!openRef.current) openTimer.current = setTimeout(() => setOpen(true), delay);
      },
    ),
    onPointerLeave: composeEventHandlers(child.props.onPointerLeave, () => {
      hovering.current = false;
      clearTimeout(openTimer.current);
      if (openRef.current) closeAfterGrace();
    }),
    onPointerDown: composeEventHandlers(child.props.onPointerDown, () => {
      pressing.current = true;
      document.addEventListener("pointerup", () => (pressing.current = false), { once: true });
    }),
    onClick: composeEventHandlers(child.props.onClick, () => setOpen(false)),
    onFocus: composeEventHandlers(child.props.onFocus, () => {
      if (!pressing.current) setOpen(true);
    }),
    onBlur: composeEventHandlers(child.props.onBlur, () => setOpen(false)),
  } as TriggerProps);

  return (
    <>
      {trigger}
      {open ? (
        <div
          {...popoverProps}
          role="tooltip"
          id={id}
          className={["kui-tooltip", className].filter(Boolean).join(" ")}
          data-state={state}
          style={{ ...popoverProps.style, ...style }}
          onPointerEnter={composeEventHandlers(onPointerEnter, () =>
            clearTimeout(closeTimer.current),
          )}
          onPointerLeave={composeEventHandlers(onPointerLeave, closeAfterGrace)}
          {...props}
        >
          {content}
        </div>
      ) : null}
    </>
  );
});
