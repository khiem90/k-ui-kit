import { version, type ReactElement, type Ref, type RefCallback } from "react";

// Internal helpers that merge what a Consumer passes with what a Component adds: refs and event
// handlers. The entry never exports them. tsup builds this file as its own module beside slot.js.

/**
 * Sets one ref, whichever kind it is, and returns what a callback ref returned, so a React 19
 * cleanup function reaches the caller.
 */
export function setRef<T>(ref: Ref<T> | undefined, node: T | null): unknown {
  if (typeof ref === "function") return ref(node);
  if (ref) ref.current = node;
}

const isFunction = (value: unknown): value is () => void => typeof value === "function";

/** One ref callback that sets every ref given. Memoise it, or React resets the refs each render. */
export function composeRefs<T>(...refs: (Ref<T> | undefined)[]): RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => setRef(ref, node));
    // React 19 calls a returned cleanup in place of calling the ref again with null.
    if (cleanups.some(isFunction)) {
      return () => {
        cleanups.forEach((cleanup, index) => {
          if (isFunction(cleanup)) cleanup();
          else setRef(refs[index], null);
        });
      };
    }
  };
}

// React 19 moved an element's ref into its props and warns when element.ref is read. React 18
// keeps it on the element and strips it from the props.
const refIsAProp = Number(version.split(".")[0]) >= 19;

/** The ref a Consumer put on an element, read where their React version keeps it. */
export function getElementRef<T>(element: ReactElement): Ref<T> | undefined {
  const holder = (refIsAProp ? element.props : element) as { ref?: Ref<T> };
  return holder.ref;
}

/**
 * Runs the Consumer's handler first, then the Component's own, unless the Consumer's handler
 * called `preventDefault`. That is how a Consumer opts out of what the kit does on an event.
 */
export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  consumerHandler: ((event: E) => void) | undefined,
  kitHandler: (event: E) => void,
): (event: E) => void {
  return (event) => {
    consumerHandler?.(event);
    if (!event.defaultPrevented) kitHandler(event);
  };
}
