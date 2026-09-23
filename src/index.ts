// This module carries no client directive on purpose. Each Component's file does, and stays its own
// file in the build, so a server component sees the namespaces below as plain objects whose parts
// are client references. See docs/adr/0003-client-boundary-below-the-entry.md.

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "./components/Dialog/Dialog.js";
import {
  RadioGroupItem,
  RadioGroupLabel,
  RadioGroupRoot,
} from "./components/RadioGroup/RadioGroup.js";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectTrigger,
} from "./components/Select/Select.js";
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from "./components/Tabs/Tabs.js";

export { Button } from "./components/Button/Button.js";
export type { ButtonProps, ButtonSize, ButtonVariant } from "./components/Button/Button.js";
export { TextField } from "./components/TextField/TextField.js";
export type { TextFieldProps, TextFieldSize } from "./components/TextField/TextField.js";
export { Checkbox } from "./components/Checkbox/Checkbox.js";
export type { CheckboxProps } from "./components/Checkbox/Checkbox.js";
export { Switch } from "./components/Switch/Switch.js";
export type { SwitchProps } from "./components/Switch/Switch.js";
export type {
  RadioGroupItemProps,
  RadioGroupLabelProps,
  RadioGroupOrientation,
  RadioGroupRootProps,
} from "./components/RadioGroup/RadioGroup.js";
export { Tooltip } from "./components/Tooltip/Tooltip.js";
export type { TooltipProps, TooltipSide } from "./components/Tooltip/Tooltip.js";
export type {
  TabsContentProps,
  TabsListProps,
  TabsOrientation,
  TabsRootProps,
  TabsTriggerProps,
} from "./components/Tabs/Tabs.js";
export type {
  DialogCloseProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogRootProps,
  DialogTitleProps,
  DialogTriggerProps,
} from "./components/Dialog/Dialog.js";
export type {
  SelectContentProps,
  SelectGroupProps,
  SelectItemProps,
  SelectRootProps,
  SelectSize,
  SelectTriggerProps,
} from "./components/Select/Select.js";
export { DataTable } from "./components/DataTable/DataTable.js";
export type { ColumnDef, DataTableProps } from "./components/DataTable/DataTable.js";

/**
 * A set of mutually exclusive options. Arrow keys move selection, and the whole group is one Tab
 * stop that lands on the selected item.
 */
export const RadioGroup = { Root: RadioGroupRoot, Item: RadioGroupItem, Label: RadioGroupLabel };

/**
 * A set of panels with one shown at a time. Arrow keys move between the tabs and activate the
 * one they land on, Home and End jump to the first and last, and only the active panel is in
 * the Tab order.
 */
export const Tabs = { Root: TabsRoot, List: TabsList, Trigger: TabsTrigger, Content: TabsContent };

/**
 * A modal window over the page. Opening it moves focus inside and holds it there, the page behind
 * stops scrolling, and Escape or a click on the overlay closes it and returns focus to the trigger.
 */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};

/**
 * Picks one value from a list. Enter, Space, and the arrow keys open the list from the trigger,
 * arrows move through the options, typing jumps to a match, Enter picks the option under focus, and
 * Escape closes the list and returns focus to the trigger.
 */
export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Group: SelectGroup,
};
