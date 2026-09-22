"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from "react";

export type TabsOrientation = "horizontal" | "vertical";

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
  { orientation = "horizontal", className, ...props },
  ref,
) {
  return (
    <TabsPrimitive.Root
      ref={ref}
      className={["kui-tabs", className].filter(Boolean).join(" ")}
      orientation={orientation}
      {...props}
    />
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the tablist role.
 * Name it with `aria-label`.
 */
export type TabsListProps = HTMLAttributes<HTMLDivElement>;

const List = forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { className, ...props },
  ref,
) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={["kui-tabs__list", className].filter(Boolean).join(" ")}
      {...props}
    />
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
  { className, ...props },
  ref,
) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={["kui-tabs__trigger", className].filter(Boolean).join(" ")}
      {...props}
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
  { className, ...props },
  ref,
) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={["kui-tabs__content", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

/**
 * A set of panels with one shown at a time. Arrow keys move between the tabs and activate the
 * one they land on, Home and End jump to the first and last, and only the active panel is in
 * the Tab order.
 */
export const Tabs = { Root, List, Trigger, Content };
