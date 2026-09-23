"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import {
  createContext,
  forwardRef,
  useContext,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

interface RadioGroupContextValue {
  value: string | undefined;
  disabled: boolean;
  labelId: string;
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
    "aria-label": ariaLabel,
    children,
    ...props
  },
  ref,
) {
  // Owning the state lets each item put data-state on its root, the way Checkbox and Switch do.
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const value = isControlled ? valueProp : uncontrolledValue;
  const labelId = useId();

  // Radix passes null when a form reset clears the selection.
  const handleValueChange = (next: string | null) => {
    if (!isControlled) setUncontrolledValue(next ?? undefined);
    if (next !== null) onValueChange?.(next);
  };

  // The Label part renders under labelId, so server HTML already names the group, and a Consumer
  // who names it with aria-label gets no dangling reference. Orientation only sets the layout:
  // handing it to Radix would limit the arrow keys to one axis, and native radios answer all four.
  return (
    <RadioGroupContext.Provider value={{ value, disabled, labelId }}>
      <RadioGroupPrimitive.Root
        ref={ref}
        className={["kui-radio-group", className].filter(Boolean).join(" ")}
        value={value ?? null}
        onValueChange={handleValueChange}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelId}
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
        className="kui-radio__circle"
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

/** The group owns the label's id and points aria-labelledby at it, so `id` is not accepted. */
export type RadioGroupLabelProps = Omit<HTMLAttributes<HTMLSpanElement>, "id">;

const Label = forwardRef<HTMLSpanElement, RadioGroupLabelProps>(function RadioGroupLabel(
  { className, ...props },
  ref,
) {
  const { labelId } = useRadioGroupContext("Label");

  return (
    <span
      ref={ref}
      id={labelId}
      className={["kui-radio-group__label", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
});

export { Root as RadioGroupRoot, Item as RadioGroupItem, Label as RadioGroupLabel };
