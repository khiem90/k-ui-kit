import {
  Children,
  cloneElement,
  forwardRef,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { composeRefs, getElementRef } from "./compose.js";

// The kit's own asChild Slot, for Button and Dialog.Close (ADR 0004). It is internal: the entry
// never exports it, and tsup builds it as its own file beside icons.js.

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  /** The single element that receives the props. */
  children?: ReactNode;
}

type Props = Record<string, unknown>;

/**
 * Renders its single child element with the Slot's props merged in. The child's props win, except
 * that class names are joined, styles are merged, refs are composed, and event handlers both run:
 * the child's first, then the Slot's unless the child's handler prevented the default.
 */
export const Slot = forwardRef<HTMLElement, SlotProps>(function Slot(
  { children, ...slotProps },
  forwardedRef,
) {
  const child = Children.only(children) as ReactElement<Props>;
  const childRef = getElementRef<HTMLElement>(child);
  const ref = useMemo(() => composeRefs(forwardedRef, childRef), [forwardedRef, childRef]);

  return cloneElement(child, { ...mergeProps(slotProps, child.props), ref });
});

function mergeProps(slotProps: Props, childProps: Props): Props {
  const merged: Props = { ...slotProps };
  for (const [key, childValue] of Object.entries(childProps)) {
    const slotValue = slotProps[key];
    if (childValue === undefined) continue;
    if (key === "className") {
      merged[key] = [slotValue, childValue].filter(Boolean).join(" ");
    } else if (key === "style") {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
    } else if (/^on[A-Z]/.test(key) && isFunction(slotValue) && isFunction(childValue)) {
      merged[key] = (...args: unknown[]) => {
        const result = childValue(...args);
        if (!(args[0] as { defaultPrevented?: boolean } | undefined)?.defaultPrevented) {
          slotValue(...args);
        }
        return result;
      };
    } else {
      merged[key] = childValue;
    }
  }
  return merged;
}

function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === "function";
}
