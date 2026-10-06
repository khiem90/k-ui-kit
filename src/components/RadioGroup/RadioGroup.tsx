"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
} from "react";

interface RadioGroupContextValue {
  value: string | undefined;
  /** The value a form reset returns the group to. */
  resetValue: string | undefined;
  name: string;
  required: boolean;
  disabled: boolean;
  labelId: string;
  select: (value: string) => void;
  reset: () => void;
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
    name: nameProp,
    required = false,
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
  // The items are native radios, so the shared name is what makes the browser treat them as one
  // group: one Tab stop, arrow keys that move the selection, and one value in the form.
  const generatedName = useId();
  const name = nameProp ?? generatedName;

  const select = (next: string) => {
    if (!isControlled) setUncontrolledValue(next);
    onValueChange?.(next);
  };

  // A form reset puts native radios back to their default. Uncontrolled, that is defaultValue.
  // Controlled, the default tracks the current value, so a reset leaves the selection alone.
  const reset = useCallback(() => {
    if (!isControlled) setUncontrolledValue(defaultValue);
  }, [isControlled, defaultValue]);

  // The Label part renders under labelId, so server HTML already names the group, and a Consumer
  // who names it with aria-label gets no dangling reference. Orientation only sets the layout:
  // native radios answer all four arrow keys whichever way the items run.
  return (
    <RadioGroupContext.Provider
      value={{
        value,
        resetValue: isControlled ? value : defaultValue,
        name,
        required,
        disabled,
        labelId,
        select,
        reset,
      }}
    >
      <div
        ref={ref}
        role="radiogroup"
        className={["kui-radio-group", className].filter(Boolean).join(" ")}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelId}
        aria-required={required}
        aria-orientation={orientation}
        data-orientation={orientation}
        data-disabled={disabled ? "" : undefined}
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});

/**
 * `className` lands on the root element. Every other prop, including the ref, goes to the radio
 * input.
 */
export interface RadioGroupItemProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "type" | "name" | "children" | "checked" | "defaultChecked"
> {
  /** Reported through onValueChange and submitted with the form when this item is selected. */
  value: string;
  /** Visible label. It is also the item's accessible name, and clicking it selects the item. */
  label: ReactNode;
}

function setRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === "function") ref(node);
  else if (ref) ref.current = node;
}

const Item = forwardRef<HTMLInputElement, RadioGroupItemProps>(function RadioGroupItem(
  { value, label, disabled, id: idProp, className, onChange, ...props },
  ref,
) {
  const group = useRadioGroupContext("Item");
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const checked = group.value === value;
  const isDefault = group.resetValue === value;
  const isDisabled = group.disabled || disabled;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInputRef = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      setRef(ref, node);
    },
    [ref],
  );

  // React writes the checked attribute once, at mount. Keeping it on the default item means a
  // native form reset restores the selection the group's state will settle on.
  useEffect(() => {
    if (inputRef.current) inputRef.current.defaultChecked = isDefault;
  }, [isDefault]);

  const { reset } = group;
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    form.addEventListener("reset", reset);
    return () => form.removeEventListener("reset", reset);
  }, [reset]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event);
    if (event.currentTarget.checked) group.select(value);
  };

  return (
    <div
      className={["kui-radio", className].filter(Boolean).join(" ")}
      data-state={checked ? "checked" : "unchecked"}
      data-disabled={isDisabled ? "" : undefined}
    >
      <span className="kui-radio__control">
        <input
          ref={setInputRef}
          type="radio"
          id={id}
          className="kui-radio__input"
          name={group.name}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={isDisabled}
          required={group.required}
          {...props}
        />
        <span className="kui-radio__circle" aria-hidden="true">
          <span className="kui-radio__indicator" />
        </span>
      </span>
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
