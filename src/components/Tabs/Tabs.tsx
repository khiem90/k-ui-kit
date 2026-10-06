"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type SyntheticEvent,
} from "react";

export type TabsOrientation = "horizontal" | "vertical";

interface TabsContextValue {
  baseId: string;
  value: string | undefined;
  select: (value: string) => void;
  orientation: TabsOrientation;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(part: string) {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`Tabs.${part} must be rendered inside Tabs.Root.`);
  return context;
}

// The id of the tab that holds the Tab stop when no enabled tab is active.
const FallbackStopContext = createContext<string | undefined>(undefined);

// Spaces would split an id reference list, so they become hyphens.
const partId = (baseId: string, part: string, value: string) =>
  `${baseId}-${part}-${value.replace(/\s/g, "-")}`;

const join = (...classNames: (string | undefined)[]) => classNames.filter(Boolean).join(" ");

// The Consumer's handler runs first. Calling preventDefault in it skips the kit's handler.
function compose<E extends SyntheticEvent>(
  theirs: ((event: E) => void) | undefined,
  ours: (event: E) => void,
) {
  return (event: E) => {
    theirs?.(event);
    if (!event.defaultPrevented) ours(event);
  };
}

/**
 * The ref, `className`, and every other prop go to the element that wraps the list and the panels.
 * A value names each tab: the same string on a Trigger and a Content part pairs them.
 */
export interface TabsRootProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "dir"
> {
  /** Controlled active tab. Pair it with onValueChange. */
  value?: string;
  /** Initial active tab when uncontrolled. Without it no tab is active until the user picks one. */
  defaultValue?: string;
  /** Called with the value of the tab the user activates. */
  onValueChange?: (value: string) => void;
  /**
   * Lays the list out in a row above the panels or a column beside them. Left and Right move
   * between horizontal tabs, Up and Down between vertical ones.
   */
  orientation?: TabsOrientation;
}

const Root = forwardRef<HTMLDivElement, TabsRootProps>(function TabsRoot(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    className,
    ...props
  },
  ref,
) {
  const baseId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;

  const select = useCallback(
    (next: string) => {
      if (next === value) return;
      if (!isControlled) setUncontrolledValue(next);
      onValueChange?.(next);
    },
    [value, isControlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ baseId, value, select, orientation }}>
      <div
        ref={ref}
        className={join("kui-tabs", className)}
        data-orientation={orientation}
        {...props}
      />
    </TabsContext.Provider>
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the tablist role.
 * Name it with `aria-label`.
 */
export type TabsListProps = HTMLAttributes<HTMLDivElement>;

function tabsIn(list: Element) {
  return Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).filter(
    (tab) => tab.closest('[role="tablist"]') === list,
  );
}

const List = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, children, ...props },
  forwardedRef,
) {
  const { orientation, value } = useTabsContext("List");
  const listRef = useRef<HTMLDivElement | null>(null);
  const [fallbackStop, setFallbackStop] = useState<string>();

  // When no enabled tab is active, the first enabled tab holds the Tab stop, so keyboard users can
  // still reach the list. The answer reads the rendered tabs, and changes when the active value
  // does or when the children change, since that is how a tab gains or loses `disabled`.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const enabled = tabsIn(list).filter((tab) => !tab.disabled);
    const hasActive = enabled.some((tab) => tab.getAttribute("aria-selected") === "true");
    setFallbackStop(hasActive ? undefined : enabled[0]?.id);
  }, [value, children]);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      listRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  return (
    <FallbackStopContext.Provider value={fallbackStop}>
      <div
        ref={setRef}
        role="tablist"
        aria-orientation={orientation}
        className={join("kui-tabs__list", className)}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </div>
    </FallbackStopContext.Provider>
  );
});

/** The ref, `className`, and every other prop go to the button that carries the tab role. */
export interface TabsTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "type"
> {
  /** Pairs the tab with the Content part of the same value, and is reported through onValueChange. */
  value: string;
}

const Trigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, disabled = false, className, onMouseDown, onFocus, onKeyDown, ...props },
  ref,
) {
  const context = useTabsContext("Trigger");
  const fallbackStop = useContext(FallbackStopContext);
  const id = partId(context.baseId, "trigger", value);
  const isActive = context.value === value;
  const isTabStop = (isActive && !disabled) || fallbackStop === id;

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const list = event.currentTarget.closest('[role="tablist"]');
    if (!list) return;
    const horizontal = context.orientation === "horizontal";
    const rtl = horizontal && getComputedStyle(list).direction === "rtl";
    const intent: Record<string, "previous" | "next" | "first" | "last" | undefined> = {
      ArrowLeft: horizontal ? (rtl ? "next" : "previous") : undefined,
      ArrowRight: horizontal ? (rtl ? "previous" : "next") : undefined,
      ArrowUp: horizontal ? undefined : "previous",
      ArrowDown: horizontal ? undefined : "next",
      Home: "first",
      PageUp: "first",
      End: "last",
      PageDown: "last",
    };
    const move = intent[event.key];
    if (!move) return;
    event.preventDefault();
    const tabs = tabsIn(list).filter((tab) => !tab.disabled);
    if (tabs.length === 0) return;
    const current = tabs.indexOf(event.currentTarget);
    const index =
      move === "first"
        ? 0
        : move === "last"
          ? tabs.length - 1
          : (current + (move === "next" ? 1 : -1) + tabs.length) % tabs.length;
    // Focusing a tab activates it, through the focus handler below.
    tabs[index]?.focus();
  };

  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={partId(context.baseId, "content", value)}
      tabIndex={isTabStop ? 0 : -1}
      disabled={disabled}
      data-state={isActive ? "active" : "inactive"}
      data-disabled={disabled ? "" : undefined}
      data-orientation={context.orientation}
      className={join("kui-tabs__trigger", className)}
      {...props}
      // A primary press activates before focus lands, so the tab and its panel switch together.
      // Other buttons and Ctrl-click leave focus where it is.
      onMouseDown={compose(onMouseDown, (event) => {
        if (disabled) return;
        if (event.button === 0 && !event.ctrlKey) context.select(value);
        else event.preventDefault();
      })}
      onFocus={compose(onFocus, () => {
        if (!disabled) context.select(value);
      })}
      onKeyDown={compose(onKeyDown, moveFocus)}
    />
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the tabpanel role.
 * Only the active panel renders its children; the others stay in the DOM hidden and empty.
 */
export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Pairs the panel with the Trigger part of the same value. */
  value: string;
}

const Content = forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, className, children, ...props },
  ref,
) {
  const context = useTabsContext("Content");
  const isActive = context.value === value;
  return (
    <div
      ref={ref}
      role="tabpanel"
      id={partId(context.baseId, "content", value)}
      aria-labelledby={partId(context.baseId, "trigger", value)}
      // The panel is a Tab stop, so keyboard users reach content that has no focusable element.
      tabIndex={0}
      hidden={!isActive}
      data-state={isActive ? "active" : "inactive"}
      data-orientation={context.orientation}
      className={join("kui-tabs__content", className)}
      {...props}
    >
      {isActive ? children : null}
    </div>
  );
});

export { Root as TabsRoot, List as TabsList, Trigger as TabsTrigger, Content as TabsContent };
