"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface RadioGroupContextValue {
  value: string | undefined;
  disabled: boolean;
  setLabelId: (id: string | undefined) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext(part: string) {
  const context = useContext(RadioGroupContext);
  if (!context) throw new Error(`RadioGroup.${part} must be rendered inside RadioGroup.Root.`);
  return context;
}

export type RadioGroupOrientation = "horizontal" | "vertical";

/**
 * The ref, `className`, and every other prop go to the element that carries the radiogroup role.
 * Name the group with a `RadioGroup.Label` part or `aria-label`.
 */
export interface RadioGroupRootProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "dir"
> {
  /** Controlled selected value. Pair it with onValueChange. */
  value?: string;
  /** Initial selected value when uncontrolled. */
  defaultValue?: string;
  /** Called with the value of the item the user selects. */
  onValueChange?: (value: string) => void;
  /** Submitted with the form under this name, like a native radio group. */
  name?: string;
  /** Marks the group as required for form validation and announces it as such. */
  required?: boolean;
  /** Disables every item. */
  disabled?: boolean;
  /** Lays the items out in a column or a row. All four arrow keys move selection either way. */
  orientation?: RadioGroupOrientation;
}

const Root = forwardRef<HTMLDivElement, RadioGroupRootProps>(function RadioGroupRoot(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    disabled = false,
    orientation = "vertical",
    className,
    children,
    ...props
  },
  ref,
) {
  // Owning the state lets each item put data-state on its root, the way Checkbox and Switch do.
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;
  const [labelId, setLabelId] = useState<string>();

  // Radix passes null when a form reset clears the selection.
  const handleValueChange = (next: string | null) => {
    if (!isControlled) setUncontrolledValue(next ?? undefined);
    if (next !== null) onValueChange?.(next);
  };

  return (
    <RadioGroupContext.Provider value={{ value, disabled, setLabelId }}>
      <RadioGroupPrimitive.Root
        ref={ref}
        className={["kui-radio-group", className].filter(Boolean).join(" ")}
        value={value ?? null}
        onValueChange={handleValueChange}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-orientation={orientation}
        data-orientation={orientation}
        {...props}
      >
        {children}
      </RadioGroupPrimitive.Root>
    </RadioGroupContext.Provider>
  );
});

/**
 * `className` lands on the root element. Every other prop, including the ref, goes to the button
 * that carries the radio role.
 */
export interface RadioGroupItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "value" | "type" | "name" | "children"
> {
  /** Reported through onValueChange and submitted with the form when this item is selected. */
  value: string;
  /** Visible label. It is also the item's accessible name, and clicking it selects the item. */
  label: ReactNode;
}

const Item = forwardRef<HTMLButtonElement, RadioGroupItemProps>(function RadioGroupItem(
  { value, label, disabled, id: idProp, className, ...props },
  ref,
) {
  const group = useRadioGroupContext("Item");
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const checked = group.value === value;
  const isDisabled = group.disabled || disabled;

  return (
    <div
      className={["kui-radio", className].filter(Boolean).join(" ")}
      data-state={checked ? "checked" : "unchecked"}
      data-disabled={isDisabled ? "" : undefined}
    >
      <RadioGroupPrimitive.Item
        ref={ref}
        id={id}
        className="kui-radio__control"
        value={value}
        disabled={disabled}
        {...props}
      >
        <RadioGroupPrimitive.Indicator className="kui-radio__indicator" />
      </RadioGroupPrimitive.Item>
      <label className="kui-radio__label" htmlFor={id}>
        {label}
      </label>
    </div>
  );
});

export type RadioGroupLabelProps = HTMLAttributes<HTMLSpanElement>;

const Label = forwardRef<HTMLSpanElement, RadioGroupLabelProps>(function RadioGroupLabel(
  { id: idProp, className, ...props },
  ref,
) {
  const { setLabelId } = useRadioGroupContext("Label");
  const generatedId = useId();
  const id = idProp ?? generatedId;

  useEffect(() => {
    setLabelId(id);
    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <span
      ref={ref}
      id={id}
      className={["kui-radio-group__label", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

/**
 * A set of mutually exclusive options. Arrow keys move selection, and the whole group is one Tab
 * stop that lands on the selected item.
 */
export const RadioGroup = { Root, Item, Label };
