"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { forwardRef, type HTMLAttributes, type ReactElement, type ReactNode } from "react";

export type TooltipSide = "top" | "right" | "bottom" | "left";

/** Gap between the trigger and the box: the arrow's 5px height plus a hair of daylight. */
const SIDE_OFFSET = 6;
/** Room the box keeps from the viewport edge before it flips to the other side or slides along. */
const COLLISION_PADDING = 8;

/**
 * The child is the trigger and receives the hover, focus, and aria wiring. `className`, the ref,
 * and every other prop go to the tooltip box, which exists only while the tooltip is open.
 */
export interface TooltipProps extends Omit<HTMLAttributes<HTMLDivElement>, "content" | "children"> {
  /** What the tooltip says. Announced as the trigger's description, so keep it to plain text. */
  content: ReactNode;
  /** Side of the trigger the tooltip opens on. It flips to the opposite side when there is no room. */
  side?: TooltipSide;
  /** Milliseconds the pointer rests on the trigger before it opens. Defaults to 700. Focus opens it at once. */
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

/**
 * A short description of its trigger. It opens on hover and keyboard focus, closes on Escape and
 * blur, and screen readers read it as the trigger's description.
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(
  { content, side = "top", delay, open, defaultOpen, onOpenChange, className, children, ...props },
  ref,
) {
  return (
    <TooltipPrimitive.Provider delayDuration={delay}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            ref={ref}
            className={["kui-tooltip", className].filter(Boolean).join(" ")}
            side={side}
            sideOffset={SIDE_OFFSET}
            collisionPadding={COLLISION_PADDING}
            {...props}
          >
            {content}
            <TooltipPrimitive.Arrow className="kui-tooltip__arrow" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
});
