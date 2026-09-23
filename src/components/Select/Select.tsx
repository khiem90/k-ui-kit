"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { CheckIcon, ChevronDownIcon } from "../../icons.js";

export type SelectSize = "sm" | "md" | "lg";

/** Gap between the trigger and the list. */
const SIDE_OFFSET = 4;
/** Room the list keeps from the viewport edge before it flips above the trigger or slides along. */
const COLLISION_PADDING = 8;

interface SelectContextValue {
  open: boolean;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(part: string) {
  const context = useContext(SelectContext);
  if (!context) throw new Error(`Select.${part} must be rendered inside Select.Root.`);
  return context;
}

/**
 * Root renders no element of its own, so it takes no ref, class name, or DOM props. Inside a form it
 * also renders a hidden native select, which submits the value under `name`.
 */
export interface SelectRootProps {
  /** Controlled selected value. Pair it with onValueChange. */
  value?: string;
  /** Initial selected value when uncontrolled. */
  defaultValue?: string;
  /** Called with the value of the item the user picks. */
  onValueChange?: (value: string) => void;
  /** Submitted with the surrounding form under this name, like a native select. */
  name?: string;
  /** Marks the select as required for form validation and announces it as such. */
  required?: boolean;
  /** Disables the trigger, so the list cannot open and the value cannot change. */
  disabled?: boolean;
  /** The Trigger and Content parts. */
  children?: ReactNode;
}

const Root = ({ children, ...props }: SelectRootProps) => {
  // Owning the open state lets the trigger leave the Tab order while the list is open. Focus is
  // held inside the list then, and Radix hides the rest of the page from assistive technology, so
  // a trigger still in the Tab order would be a focusable element inside aria-hidden.
  const [open, setOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ open }}>
      <SelectPrimitive.Root open={open} onOpenChange={setOpen} {...props}>
        {children}
      </SelectPrimitive.Root>
    </SelectContext.Provider>
  );
};

/**
 * The ref, `className`, and every other prop go to the button that carries the combobox role. It
 * shows the selected item's text, or the placeholder until one is picked, and the chevron. Name it
 * with a visible `label` pointed at its `id`, or with `aria-label`. Disable it through Root.
 */
export interface SelectTriggerProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "disabled" | "type" | "value"
> {
  /** Shown in the trigger until an item is picked. */
  placeholder?: ReactNode;
  /** Matches the TextField and Button heights. */
  size?: SelectSize;
}

const Trigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(function SelectTrigger(
  { placeholder, size = "md", className, ...props },
  ref,
) {
  const { open } = useSelectContext("Trigger");

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={["kui-select__trigger", className].filter(Boolean).join(" ")}
      data-size={size}
      tabIndex={open ? -1 : undefined}
      {...props}
    >
      <SelectPrimitive.Value className="kui-select__value" placeholder={placeholder} />
      <SelectPrimitive.Icon className="kui-select__icon">
        <ChevronDownIcon />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the listbox role. It
 * renders in a portal at the end of body, below the trigger or above it when there is no room, and
 * at least as wide as the trigger. A long list scrolls, with a button at either end that scrolls it
 * while the pointer rests there.
 */
export type SelectContentProps = HTMLAttributes<HTMLDivElement>;

const Content = forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(
  { className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={["kui-select__content", className].filter(Boolean).join(" ")}
        position="popper"
        sideOffset={SIDE_OFFSET}
        collisionPadding={COLLISION_PADDING}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="kui-select__scroll-button" data-side="up">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="kui-select__viewport">
          {children}
        </SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="kui-select__scroll-button" data-side="down">
          <ChevronDownIcon />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the option role. The
 * children are the option's text: they show in the list, and in the trigger once picked.
 */
export interface SelectItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Reported through onValueChange when this item is picked. */
  value: string;
  /** Keeps the item in the list but stops it being picked. Arrow keys and typeahead skip it. */
  disabled?: boolean;
  /** The option's text. */
  children: ReactNode;
}

const Item = forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={["kui-select__item", className].filter(Boolean).join(" ")}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="kui-select__item-indicator">
        <CheckIcon />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
});

/**
 * The ref, `className`, and every other prop go to the element that carries the group role.
 */
export interface SelectGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Heading shown above the group's items. It is also the group's accessible name. */
  label: ReactNode;
}

const Group = forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { label, className, children, ...props },
  ref,
) {
  return (
    <SelectPrimitive.Group
      ref={ref}
      className={["kui-select__group", className].filter(Boolean).join(" ")}
      {...props}
    >
      <SelectPrimitive.Label className="kui-select__group-label">{label}</SelectPrimitive.Label>
      {children}
    </SelectPrimitive.Group>
  );
});

export {
  Root as SelectRoot,
  Trigger as SelectTrigger,
  Content as SelectContent,
  Item as SelectItem,
  Group as SelectGroup,
};
